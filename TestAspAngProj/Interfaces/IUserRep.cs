using TestAspAngProj.Models;

namespace TestAspAngProj.Interfaces
{
    public interface IUserRep
    {
        public User GetUserById(int id);
        public User GetUserByName(string username);
        public bool UserExists(string username);
        public string GetPasswordHashByUsername(string username);
        public bool CreateNewUser(UserDto user);
        public Task<IEnumerable<UserResponse>> SearchUsersByNickname(string nickname, int userid);
        public Task ChangeNickname(int userId, string nickname);
        public Task ChangeUserImg(int userId, string imgUrl);
    }
}
