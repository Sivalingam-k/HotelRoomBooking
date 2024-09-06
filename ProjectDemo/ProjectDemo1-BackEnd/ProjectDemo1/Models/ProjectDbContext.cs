using Microsoft.EntityFrameworkCore;

namespace ProjectDemo1.Models
{
    public class ProjectDbContext:DbContext
    {

        public ProjectDbContext(DbContextOptions<ProjectDbContext> options) : base(options) { }


        public DbSet<User> Users { get; set; }
        public DbSet<Room> Rooms { get; set; }
    }
}
