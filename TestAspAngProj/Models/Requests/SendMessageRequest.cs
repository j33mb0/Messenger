namespace TestAspAngProj.Models.Requests
{
    public class SendMessageRequest
    {
        public int chatId { get; set; }
        public int userId { get; set; }
        public string message { get; set; }
    }
}
