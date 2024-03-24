using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Primitives;
using System.Collections.Concurrent;

namespace TestAspAngProj.Hubs
{
    public class ChatHub : Hub
    {
        public static readonly ConcurrentDictionary<string, string> UserConnections = new ConcurrentDictionary<string, string>();

        public override async Task OnConnectedAsync()
        {
            var userId = Context.GetHttpContext().Request.Query["userId"];
            if (!string.IsNullOrWhiteSpace(userId))
            {
                UserConnections.AddOrUpdate(userId, Context.ConnectionId, (_, oldConnectionId) => Context.ConnectionId);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userId = Context.GetHttpContext().Request.Query["userId"];
            {
                UserConnections.TryRemove(userId, out _);
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task CreateChatUpdate(string userId, string message)
        {
            if (UserConnections.TryGetValue(userId, out var userConnection))
            {
                await Clients.Client(userConnection).SendAsync("ReceiveChatUpdate", message);
            }
        }

        public async Task SendMessage(string chatId, string userId, string message)
        {
            if (UserConnections.TryGetValue(userId, out var userConnection))
            {
                await Clients.Client(userConnection).SendAsync("ReceiveMessage", message);
            }
        }
    }
}
