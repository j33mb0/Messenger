using TestAspAngProj.Hubs;
using TestAspAngProj.Interfaces;
using TestAspAngProj.Models;
using TestAspAngProj.Models.Requests;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace TestAspAngProj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
        private IUserRep _userRep;
        private IChatRep _chatRep;
        private readonly IHubContext<ChatHub> _hubContext;

        public DataController(IUserRep userRep, IChatRep chatRep, IHubContext<ChatHub> hubContext)
        {
            _userRep = userRep;
            _chatRep = chatRep;
            _hubContext = hubContext;
        }

        [HttpGet("getuser/{userId}")]
        public ActionResult<UserResponse> GetUser(int userId)
        {
            var user = _userRep.GetUserById(userId);
            if (user != null)
            {
                var userResponse = new UserResponse() { username = user.Username, userimgurl = user.UserImgUrl };
                return Ok(userResponse);
            }
            return null;

        }

        [HttpGet("GetChats/{userId}")]
        public async Task<ActionResult<IEnumerable<GetChatsRequest>>> GetChats(int userId)
        {
            var chats = await _chatRep.GetChatsByUserId(userId);
            return Ok(chats);
        }

        [HttpGet("GetMessages/{chatId}")]
        public async Task<ActionResult<IEnumerable<GetMessagesResponse>>> GetMessages(int chatId)
        {
            var messages = await _chatRep.GetMessagesByChatId(chatId);
            return Ok(messages);
        }

        [HttpPost("SearchUsers")]
        public async Task<ActionResult<IEnumerable<UserResponse>>> SearchUsers(SearchUsersRequest request)
        {
            var result = await _userRep.SearchUsersByNickname(request.nickname, request.userid);
            return Ok(result);
        }
        [HttpPost("CreateChat")]
        public async Task<ActionResult> CreateChat(CreateChatReq request)
        {
            if (await _chatRep.IsChatExists(request.userId, request.secondUserId))
            {
                return BadRequest("A chat with this user has already been created");
            }
            await _chatRep.CreateNewChat(request.userId, request.secondUserId);
            if (ChatHub.UserConnections.TryGetValue(request.secondUserId.ToString(), out var connectionId))
            {
                await _hubContext.Clients.Client(connectionId).SendAsync("ReceiveChatUpdate", "New chat created");
            }
            return Ok();
        }
        [HttpPost("SendMessage")]
        public async Task<ActionResult> SendMessage(SendMessageRequest request)
        {
            await _chatRep.SendMessage(request.chatId, request.userId, request.message);
            if (ChatHub.UserConnections.TryGetValue(await _chatRep.GetSecondUserIdFromChat(request.chatId, request.userId), out var connectionId))
            {
                await _hubContext.Clients.Client(connectionId).SendAsync("ReceiveMessage", request.chatId);
            }
            if (ChatHub.UserConnections.TryGetValue(request.userId.ToString(), out connectionId))
            {
                await _hubContext.Clients.Client(connectionId).SendAsync("ReceiveChatUpdate", "Update chatlistview");
            }
            return Ok();
        }
        [HttpPost("ChangeNickname")]
        public async Task<ActionResult> ChangeNickname(ChangeNicknameRequest request)
        {
            if (_userRep.GetUserByName(request.nickname) != null)
            {
                return BadRequest($"Nickname {request.nickname} already taken");
            }
            await _userRep.ChangeNickname(request.userId, request.nickname);
            return Ok();
        }
        [HttpPost("ChangeUserImg")]
        public async Task<ActionResult> ChangeUserImg(ChangeUserImgRequest request)
        {
            if (!Uri.TryCreate(request.imgUrl, UriKind.Absolute, out Uri result) ||
                 (result.Scheme != Uri.UriSchemeHttp && result.Scheme != Uri.UriSchemeHttps))
            {
                return BadRequest("invalid URL");
            }
            else
            {
                await _userRep.ChangeUserImg(request.userId, request.imgUrl);
                return Ok();
            }
        }
    }
}
