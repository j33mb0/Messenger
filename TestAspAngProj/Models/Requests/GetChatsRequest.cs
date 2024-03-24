namespace TestAspAngProj.Models.Requests
{
    public class GetChatsRequest
    {
        public int ChatId { get; set; }
        public ICollection<Message> Messages { get; set; }
        public string OtherUserName { get; set; }
        public string OtherUserImg { get; set; }
        public string LastMessage { get; set; }
        public DateTime? LastMessageDate { get; set; }
    }
}
