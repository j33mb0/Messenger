using TestAspAngProj.Interfaces;
using TestAspAngProj.Models;
using TestAspAngProj.Models.Requests;
using Microsoft.EntityFrameworkCore;

namespace TestAspAngProj.Repository
{
    public class ChatRepository : IChatRep
    {
        private ApplicationContext _context;
        private IUserRep _userRep;

        public ChatRepository(ApplicationContext context, IUserRep userRep)
        {
            _context = context;
            _userRep = userRep;
        }

        public async Task<IEnumerable<GetChatsRequest>> GetChatsByUserId(int userId)
        {
            var chats = await _context.Chats
                .Include(chat => chat.Messages)
                .Include(chat => chat.Users)
                .Where(c => c.Users.Any(u => u.UserId == userId))
                .ToListAsync();

            var result = chats.Select(chat =>
            {
                var otherUserId = chat.Users.FirstOrDefault(u => u.UserId != userId)?.UserId;
                var otherUser = _userRep.GetUserById(otherUserId.GetValueOrDefault());
                var lastMessageDate = chat.Messages.Any() ? chat.Messages.Max(m => m.Timestamp) : (DateTime?)null;
                var lastMessage = chat.Messages.Any() ? chat.Messages.Last() : null;

                return new GetChatsRequest
                {
                    ChatId = chat.ChatId,
                    Messages = chat.Messages.Select(m => new Message { Content = m.Content, Timestamp = m.Timestamp }).ToList(),
                    OtherUserName = otherUser?.Username,
                    OtherUserImg = otherUser?.UserImgUrl,
                    LastMessage = lastMessage?.Content,
                    LastMessageDate = lastMessageDate
                };
            });

            result = result.OrderByDescending(chat => chat.LastMessageDate).ToList();

            return result;
        }
        public async Task<IEnumerable<GetMessagesResponse>> GetMessagesByChatId(int chatId)
        {
            var messages = await _context.Messages
                .Include(m => m.User)
                .Where(m => m.ChatId == chatId)
                .ToListAsync();

            var result = messages.Select(message =>
            {
                return new GetMessagesResponse
                {
                    messageId = message.MessageId,
                    userId = message.UserId,
                    userName = message.User.Username,
                    content = message.Content,
                    date = message.Timestamp
                };
            });

            return result;
        }
        public async Task CreateNewChat(int userId, int secondUserId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            var secondUser = await _context.Users.FirstOrDefaultAsync(u => u.UserId == secondUserId);
            var chat = new Chat { Users = { user, secondUser } };
            _context.Chats.Add(chat);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> IsChatExists(int userId, int secondUserId)
        {
            var chat = await _context.Chats
                .Include(c => c.Users)
                .Where(c => c.Users.Any(u => u.UserId == userId) && c.Users.Any(u => u.UserId == secondUserId))
                .FirstOrDefaultAsync();

            return chat != null;
        }
        public async Task<string> GetSecondUserIdFromChat(int chatId, int firstUserId)
        {
            var chat = await _context.Chats
                .Include(c => c.Users)
                .Where(c => c.ChatId == chatId)
                .FirstOrDefaultAsync();

            var secondUserId = chat.Users.Where(u => u.UserId != firstUserId).Select(u => u.UserId).FirstOrDefault();
            return secondUserId.ToString();
        }
        public async Task SendMessage(int chatId, int userId, string text)
        {
            var user = _userRep.GetUserById(userId);
            var chat = _context.Chats.FirstOrDefault(c => c.ChatId == chatId);
            var message = new Message { Chat = chat, Content = text, User = user, Timestamp = DateTime.Now };
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
        }
    }
}
