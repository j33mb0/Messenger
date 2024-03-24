using TestAspAngProj.Models;
using TestAspAngProj.Models.Requests;

namespace TestAspAngProj.Interfaces
{
    public interface IChatRep
    {
        public Task<IEnumerable<GetChatsRequest>> GetChatsByUserId(int userId);
        public Task CreateNewChat(int userId, int secondUserId);
        public Task<bool> IsChatExists(int userId, int secondUserId);
        public Task SendMessage(int chatId, int userId, string message);
        public Task<IEnumerable<GetMessagesResponse>> GetMessagesByChatId(int chatId);
        public Task<string> GetSecondUserIdFromChat(int chatId, int firstUserId);
    }
}
