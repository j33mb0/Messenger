namespace TestAspAngProj.Models.Requests
{
    public class SearchUsersRequest
    {
        public required string nickname { get; set; }
        public required int userid { get; set; }
    }
}
