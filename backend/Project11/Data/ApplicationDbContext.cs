using Microsoft.EntityFrameworkCore;
using Project11.Models;

namespace Project11.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Book> Books { get; set; } // Maps to your "Books" table

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Book>().ToTable("Books"); // Ensure correct table mapping
        }
    }
}
