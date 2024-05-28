using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PeaceReportServer.Models;
using PeaceReportServer.Services;
using PeaceReportServer.Settings;
using PeaceReportServer.Utilities;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;

namespace PeaceReportServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMongoCollection<User> _users;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly ILogger<UserController> _logger;

        public UserController(IOptions<MongoDBSettings> mongoDBSettings, IMongoClient mongoClient, IJwtTokenService jwtTokenService, ILogger<UserController> logger)
        {
            var database = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _users = database.GetCollection<User>("UserData");
            _jwtTokenService = jwtTokenService;
            _logger = logger;
        }

        [HttpGet("userinfo")]
        public async Task<IActionResult> GetUserInfo(string authorization)
        {
            var userId = GetUserIdFromAuthorizationHeader(authorization);
            if (userId == null)
            {
                return Unauthorized("Invalid JWT token.");
            }

            var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var userInfo = new
            {
                user.Email,
                user.Name,
                user.Username,
                user.Journalist,
                user.RecieveNewsletter,
                user.AgreeWithTermsConditions
            };

            return Ok(userInfo);
        }

        [HttpPut("userinfo")]
        public async Task<IActionResult> UpdateUserInfo(string authorization, [FromBody] UserUpdateDto updateDto)
        {
            var userId = GetUserIdFromAuthorizationHeader(authorization);
            if (userId == null)
            {
                return Unauthorized("Invalid JWT token.");
            }

            var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var updateDefinition = Builders<User>.Update
                .Set(u => u.Email, updateDto.Email)
                .Set(u => u.Name, updateDto.Name)
                .Set(u => u.Username, updateDto.Username)
                .Set(u => u.Journalist, updateDto.Journalist)
                .Set(u => u.RecieveNewsletter, updateDto.RecieveNewsletter)
                .Set(u => u.AgreeWithTermsConditions, updateDto.AgreeWithTermsConditions);

            await _users.UpdateOneAsync(u => u.Id == userId, updateDefinition);

            return Ok(new { message = "User information updated successfully." });
        }

        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword(string authorization, [FromBody] ChangePasswordDto changePasswordDto)
        {
            var userId = GetUserIdFromAuthorizationHeader(authorization);
            if (userId == null)
            {
                return Unauthorized("Invalid JWT token.");
            }

            var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (!Hashing.VerifyPassword(changePasswordDto.OldPassword, user.Password))
            {
                return Unauthorized("Old password is incorrect.");
            }

            var newPasswordHash = Hashing.HashPassword(changePasswordDto.NewPassword);
            var updateDefinition = Builders<User>.Update.Set(u => u.Password, newPasswordHash);

            await _users.UpdateOneAsync(u => u.Id == userId, updateDefinition);

            return Ok(new { message = "Password changed successfully." });
        }

        private string GetUserIdFromAuthorizationHeader(string authorization)
        {
            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            {
                return null;
            }

            var token = authorization.Substring("Bearer ".Length).Trim();
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);

            var userIdClaim = jwtToken?.Claims?.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Sub);
            return userIdClaim?.Value;
        }
    }
}
