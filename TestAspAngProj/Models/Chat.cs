using System.ComponentModel.DataAnnotations;

namespace TestAspAngProj.Models
{
    public class Chat
    {
        [Key]
        public int ChatId { get; set; }

        public ICollection<User> Users { get; set; } = new List<User>();
        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}
