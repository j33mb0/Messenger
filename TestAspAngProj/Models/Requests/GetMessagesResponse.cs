namespace TestAspAngProj.Models.Requests
{
    public class GetMessagesResponse
    {
        public int messageId { get; set; }
        public int userId { get; set; }
        public string userName { get; set; }
        public string content { get; set; }
        public DateTime date { get; set; }
    }
}
