using Microsoft.EntityFrameworkCore;
using TestAspAngProj.Models;

namespace TestAspAngProj.Models
{
    public class ApplicationContext:DbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> context) : base(context)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasMany(u => u.Chats).WithMany(c => c.Users).UsingEntity(j => j.ToTable("UserChats"));
            modelBuilder.Entity<User>().HasMany(u => u.Messages).WithOne(m => m.User).HasForeignKey(m => m.UserId);
            modelBuilder.Entity<Chat>().HasMany(c => c.Messages).WithOne(m => m.Chat).HasForeignKey(m => m.ChatId);
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<Message> Messages { get; set; }
    }
}
