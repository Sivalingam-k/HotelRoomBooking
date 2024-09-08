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
        

        [HttpPost]
        [Route("ProcessPayment")]
        public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequest paymentRequest)
        {
            if (paymentRequest == null)
            {
                return BadRequest(new { message = "Invalid payment request." });
            }

            try
            {
                // Simulating payment processing
                await Task.Delay(1000); // Simulate a delay for payment processing

                // Create a payment transaction record
                var transaction = new PaymentTransaction
                {
                    RoomId = paymentRequest.RoomId,
                    Amount = paymentRequest.Amount,
                    Date = DateTime.UtcNow,
                    CardNumber = MaskCardNumber(paymentRequest.CardNumber),
                    ExpiryDate = paymentRequest.ExpiryDate,
                    Cvv = paymentRequest.Cvv,
                    Status = "Success" // Change to "Failed" for testing failure
                };

                // Save the transaction in the database
                dbContext.PaymentTransactions.Add(transaction);
                var room = await dbContext.Rooms.FindAsync(paymentRequest.RoomId);
                if (room != null)
                {
                    room.IsBooked = true;
                    dbContext.Rooms.Update(room);
                }
                await dbContext.SaveChangesAsync();

                return Ok(new { message = "Payment successful!" });
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Payment processing failed: {ex.Message}");

                return StatusCode(StatusCodes.Status500InternalServerError, new { message = $"Payment processing failed: {ex.Message}" });
            }
        }

        private string MaskCardNumber(string cardNumber)
        {
            // Mask card number for security reasons, e.g., showing only the last 4 digits
            if (cardNumber.Length > 4)
            {
                return "**** **** **** " + cardNumber.Substring(cardNumber.Length - 4);
            }
            return cardNumber;
        }
    }
}
