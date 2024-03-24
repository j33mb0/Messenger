using System.ComponentModel.DataAnnotations;

namespace TestAspAngProj.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string UserImgUrl { get; set; } = "https://cdn-icons-png.flaticon.com/512/3607/3607444.png";

        public ICollection<Message> Messages { get; set; } = new List<Message>();
        public ICollection<Chat> Chats { get; set; } = new List<Chat>();
    }
}
