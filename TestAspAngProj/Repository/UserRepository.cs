using TestAspAngProj.Interfaces;
using TestAspAngProj.Models;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace TestAspAngProj.Repository
{
    public class UserRepository : IUserRep
    {
        private ApplicationContext _context;
        private IMapper _mapper;
        public UserRepository(ApplicationContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public User GetUserById(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == id);
            return user;
        }
        public User GetUserByName(string name)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == name);
            return user;
        }
        public bool UserExists(string username)
        {
            var user = _context.Users.FirstOrDefault(user => user.Username == username);
            return user == null ? false : true;
        }
        public string GetPasswordHashByUsername(string username)
        {
            User? user = _context.Users.FirstOrDefault(u => u.Username == username);
            return user?.PasswordHash;
        }
        public bool CreateNewUser(UserDto user)
        {
            _context.Users.Add(new User { Username = user.Username, PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.Password) });
            _context.SaveChanges();
            return true;
        }
        public async Task<IEnumerable<UserResponse>> SearchUsersByNickname(string nickname, int userid)
        {
            return await _context.Users.Where(u => u.Username.Contains(nickname) && u.UserId != userid).Select(u => _mapper.Map<UserResponse>(u)).ToListAsync();
        }
        public async Task ChangeNickname(int userId, string nickname)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user != null)
            {
                user.Username = nickname;
                await _context.SaveChangesAsync();
            }
        }
        public async Task ChangeUserImg(int userId, string imgUrl)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == u.UserId);
            if (user != null)
            {
                user.UserImgUrl = imgUrl;
                await _context.SaveChangesAsync();
            }
        }
    }
}
