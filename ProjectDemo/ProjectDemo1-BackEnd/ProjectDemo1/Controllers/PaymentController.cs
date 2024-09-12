using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectDemo1.Models;

namespace ProjectDemo1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly ProjectDbContext dbContext;

        public PaymentController
            (ProjectDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        [HttpGet]
        [Route("GetRooms")]
        public async Task<IActionResult> GetRooms()
        {
            var rooms = await dbContext.Rooms
                .Select(r => new
                {
                    r.RoomNumber,
                    r.IsBooked // Assuming you have an IsBooked property
                })
                .ToListAsync();

            return Ok(rooms);
        }
        [HttpGet]
        [Route("GetAvailableRooms")]
        public async Task<IActionResult> GetAvailableRooms()
        {
            var availableRooms = await dbContext.Rooms
                .Where(r => !r.IsBooked) // Assuming you have an IsBooked property
                .Select(r => new { r.RoomNumber }) // Select only RoomNumber
                .ToListAsync();

            return Ok(availableRooms);
        }

        [HttpGet]
        [Route("GetBookedRoomsimage")]
        public async Task<IActionResult> GetBookedRoomsimage()
        {
            var bookedRooms = await dbContext.Rooms
                .Where(r => r.IsBooked)
                .ToListAsync();

            return Ok(bookedRooms);
        }

        [HttpGet]
        [Route("GetBookedRooms")]
        public async Task<IActionResult> GetBookedRooms()
        {
            var bookedRooms = await dbContext.Rooms
                .Where(r => r.IsBooked)
                .Select(r => new { r.RoomNumber }) // Select only RoomNumber
                .ToListAsync();

            return Ok(bookedRooms);
        }
       

        [HttpGet]
        [Route("GetBookedRoomsPayments")]
        public async Task<IActionResult> GetBookedRoomsPayments()
        {
            var bookedRooms = await dbContext.Rooms
                .Join(
                    dbContext.PaymentTransactions,
                    room => room.Id,
                    payment => payment.RoomId,
                    (room, payment) => new
                    {
                        
                        room.RoomNumber,
                        payment.Amount,
                        payment.Date
                    }
                )
                .Where(rp => rp.Amount > 0) // Ensure there is a payment amount
                .ToListAsync();

            return Ok(bookedRooms);
        }
        [HttpPost]
        [Route("ProcessPayment")]
        public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequest paymentRequest)
        {
            if (paymentRequest == null)
            {
                return BadRequest(new { message = "Invalid payment request." });
            }

            using var transaction = await dbContext.Database.BeginTransactionAsync();

            try
            {
                // Simulate payment processing
                await Task.Delay(1000); // Simulate a delay for payment processing

                // Retrieve room details
                var room = await dbContext.Rooms.FindAsync(paymentRequest.RoomId);
                if (room == null)
                {
                    return NotFound(new { message = "Room not found." });
                }

                if (room.IsBooked)
                {
                    return BadRequest(new { message = "Room is already booked." });
                }

                // Create a payment transaction record
                var transactionRecord = new PaymentTransaction
                {
                    RoomId = paymentRequest.RoomId,
                    Amount = paymentRequest.Amount,
                    Date = DateTime.UtcNow,
                    CardNumber = MaskCardNumber(paymentRequest.CardNumber),
                    ExpiryDate = paymentRequest.ExpiryDate,
                    Cvv = paymentRequest.Cvv,
                    Status = "Success",
                    IsBooked = true
                };

                // Create a booking record
                var booking = new Booking
                {
                    RoomId = paymentRequest.RoomId,
                   UserEmail = paymentRequest.UserEmail,
                    BookingDate = DateTime.UtcNow,
                    IsConfirmed = true,
                    RoomNumber = room.RoomNumber.ToString(), // Assuming you want to store room number as string
                    RoomType = room.RoomType,
                    RoomPrice = room.Price
                };

                // Update room status to booked
                room.IsBooked = true;

                // Save changes
                dbContext.PaymentTransactions.Add(transactionRecord);
                dbContext.bookings.Add(booking);
                dbContext.Rooms.Update(room);
                await dbContext.SaveChangesAsync();

                // Commit transaction
                await transaction.CommitAsync();

                return Ok(new { message = "Payment and booking successful!" });
            }
            catch (DbUpdateException dbEx)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Database update failed: {dbEx.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Database update failed." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Payment processing failed: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = $"Payment processing failed: {ex.Message}" });
            }
        }

        private string MaskCardNumber(string cardNumber)
        {
            if (cardNumber.Length > 4)
            {
                return "**** **** **** " + cardNumber.Substring(cardNumber.Length - 4);
            }
            return cardNumber;
        }

        [HttpGet("set-email")]
        public IActionResult SetEmail([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { message = "Email parameter is required." });
            }

            HttpContext.Session.SetString("userEmail", email);
            return Ok(new { message = "Email set in session." });
        }

        [HttpGet("GetBookedRoomsByEmail")] 
        public async Task<IActionResult> GetBookedRoomsByEmail()
        {
            var userEmail = HttpContext.Session.GetString("userEmail");

            if (string.IsNullOrEmpty(userEmail))
            {
                return BadRequest(new { message = "User email is not available. Please log in." });
            }

            try
            {
                var bookedRooms = await dbContext.bookings
                    .Where(b => b.UserEmail == userEmail && b.IsConfirmed)
                    .Select(b => new
                    {
                        b.RoomNumber,
                        b.RoomType,
                        b.RoomPrice,
                        b.BookingDate
                    })
                    .ToListAsync();

                if (bookedRooms == null || !bookedRooms.Any())
                {
                    return NotFound(new { message = "No booked rooms found for the specified email." });
                }

                return Ok(bookedRooms);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while retrieving booked rooms: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }


    }
}
