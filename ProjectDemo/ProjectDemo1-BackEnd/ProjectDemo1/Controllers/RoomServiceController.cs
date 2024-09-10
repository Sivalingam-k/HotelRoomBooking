using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectDemo1.Models;

namespace ProjectDemo1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomServiceController : ControllerBase
    {
        private readonly ProjectDbContext dbContext;

        public RoomServiceController(ProjectDbContext dbContext)
        {
            this.dbContext = dbContext;
        }


        [HttpGet]
        [Route("GetStaff")]
        public async Task<IActionResult> GetStaff()
        {
            try
            {
                var staffs = await dbContext.roomServices.ToListAsync();
                return Ok(staffs);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving staffs: {ex.Message}");
            }
        }
        [HttpPost]
        [Route("CreateStaff")]
        public async Task<IActionResult> CreateStaff([FromForm] RoomServiceDto roomServiceDto)
        {
            byte[] imagebytes = null;
            if (roomServiceDto == null)
            {
                return BadRequest("Staff data is null.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid staff data.");
            }

            // Handle file upload
            if (roomServiceDto.ImageData != null && roomServiceDto.ImageData.Length > 0)
            {
                
                using (var memoryStream = new MemoryStream())
                {
                    await roomServiceDto.ImageData.CopyToAsync(memoryStream);
                    imagebytes = memoryStream.ToArray();  // Store the image as byte array
                }
            }

            try
            {

                var roomService = new RoomService()
                {
                      StaffName = roomServiceDto.StaffName,
        Email = roomServiceDto.Email, 
        Contact = roomServiceDto.Contact,
        Address = roomServiceDto.Address, 
         Rating = roomServiceDto.Rating, 
         IsAvailable = roomServiceDto.IsAvailable, 
        Aadhar = roomServiceDto.Aadhar, 
        ImagePath = imagebytes

    };
                dbContext.roomServices.Add(roomService);
                await dbContext.SaveChangesAsync();
                return Ok(new { Message = "Staff added successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error adding staff: {ex.Message}");
            }
        }



        [HttpPut("UpdateStaff/{id}")]
        public async Task<IActionResult> UpdateStaff(int id, [FromForm] RoomServiceDto roomServiceDto)
        {
            byte[] imagebytes = null;

            if (id != roomServiceDto.Id)
            {
                return BadRequest("Staff ID mismatch");
            }

            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

            var existingStaff = await dbContext.roomServices.FindAsync(id);
            if (existingStaff == null)
            {
                return NotFound();
            }

            existingStaff.StaffName = roomServiceDto.StaffName;
            existingStaff.Address = roomServiceDto.Address;
            existingStaff.Contact = roomServiceDto.Contact;
            existingStaff.Email = roomServiceDto.Email;
            existingStaff.Rating = roomServiceDto.Rating;
            existingStaff.IsAvailable = roomServiceDto.IsAvailable;
            existingStaff.Aadhar = roomServiceDto.Aadhar;
            if (roomServiceDto.ImageData != null && roomServiceDto.ImageData.Length > 0)
            {

                using (var memoryStream = new MemoryStream())
                {
                    await roomServiceDto.ImageData.CopyToAsync(memoryStream);
                    imagebytes = memoryStream.ToArray();  // Store the image as byte array
                }
            }
            existingStaff.ImagePath = imagebytes;
            
            dbContext.roomServices.Update(existingStaff);
            await dbContext.SaveChangesAsync();

            return NoContent();
        }



        [HttpDelete]
        [Route("DeleteStaff/{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            try
            {
                var staff = await dbContext.roomServices.FindAsync(id);
                if (staff == null)
                {
                    return NotFound($"staff with ID {id} not found.");
                }

                dbContext.roomServices.Remove(staff);
                await dbContext.SaveChangesAsync();
                return NoContent(); // HTTP 204 No Content
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting Staff: {ex.Message}");
            }
        }
    }
}
