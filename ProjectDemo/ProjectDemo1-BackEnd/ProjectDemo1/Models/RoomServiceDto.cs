namespace ProjectDemo1.Models
{
    public class RoomServiceDto
    {
        public int Id { get; set; }
        public string StaffName { get; set; }
        public string Email { get; set; }
        public long Contact { get; set; }
        public string Address { get; set; }
        public int Rating { get; set; }
        public string IsAvailable { get; set; }
        public long Aadhar { get; set; }
        public IFormFile ImageData { get; set; }
        public DateTime JoinedDate { get; set; } = DateTime.Now.Date;
    }
}
