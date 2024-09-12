using Microsoft.EntityFrameworkCore;

namespace ProjectDemo1.Models
{
    public class ProjectDbContext:DbContext
    {

        public ProjectDbContext(DbContextOptions<ProjectDbContext> options) : base(options) { }


        public DbSet<User> Users { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<RoomService> roomServices { get; set; }
        public DbSet<PaymentTransaction> PaymentTransactions { get; set; }
        public DbSet<Booking> bookings { get; set; }

        public DbSet<DatePicker> DatePickers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PaymentTransaction>()
                .HasOne(pt => pt.Room)
                .WithMany() // No navigation property in Room
                .HasForeignKey(pt => pt.RoomId);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Room)
                .WithMany() // No navigation property in Room
                .HasForeignKey(b => b.RoomId);
        }

    }
}
