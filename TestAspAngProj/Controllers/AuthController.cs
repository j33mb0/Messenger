using TestAspAngProj.Interfaces;
using TestAspAngProj.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace TestAspAngProj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IConfiguration _configuration;
        private IUserRep _userRep;
        public AuthController(IConfiguration configuration, IUserRep userRep)
        {
            _configuration = configuration;
            _userRep = userRep;
        }

        [HttpPost("login")]
        public IActionResult Login(UserDto request)
        {
            if (_userRep.UserExists(request.Username) == false)
            {
                return BadRequest("User not found");
            }
            if (BCrypt.Net.BCrypt.Verify(request.Password, _userRep.GetPasswordHashByUsername(request.Username)) == false)
            {
                return BadRequest("Wrong password");
            }

            string token = CreateToken(_userRep.GetUserByName(request.Username));


            return Ok(new { token });
        }

        [HttpPost("register")]
        public IActionResult Register(UserDto request)
        {
            if (_userRep.UserExists(request.Username) == true)
            {
                return BadRequest("The login is already taken");
            }
            _userRep.CreateNewUser(request);
            return Ok();
        }


        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim> {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("Id", user.UserId.ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: creds
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

    }
}
