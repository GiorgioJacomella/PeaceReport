using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PeaceReportServer.Models;
using PeaceReportServer.Settings;
using System.IdentityModel.Tokens.Jwt;
using PeaceReportServer.Utilities;
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
        private readonly ILogger<UserController> _logger;

        public UserController(IOptions<MongoDBSettings> mongoDBSettings, IMongoClient mongoClient, ILogger<UserController> logger)
        {
            var database = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _users = database.GetCollection<User>("UserData");
            _logger = logger;
        }

        private async Task<User> ValidateToken(string token)
        {
            if (string.IsNullOrEmpty(token) || !token.StartsWith("Bearer "))
            {
                _logger.LogWarning("Invalid authorization header.");
                return null;
            }

            var jwtToken = token.Substring("Bearer ".Length).Trim();
            var tokenHandler = new JwtSecurityTokenHandler();
            JwtSecurityToken jwtSecurityToken;
            try
            {
                jwtSecurityToken = tokenHandler.ReadJwtToken(jwtToken);
            }
            catch
            {
                _logger.LogWarning("Invalid JWT token.");
                return null;
            }

            var userIdClaim = jwtSecurityToken?.Claims?.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Sub);
            if (userIdClaim == null)
            {
                _logger.LogWarning("User ID claim not found in token.");
                return null;
            }

            var userId = userIdClaim.Value;
            var user = await _users.Find(u => u.Id == userId && u.Token == jwtToken).FirstOrDefaultAsync();
            if (user == null)
            {
                _logger.LogWarning("User not found or token mismatch.");
                return null;
            }

            return user;
        }

        [HttpGet("userinfo")]
        public async Task<IActionResult> GetUserInfo([FromHeader(Name = "Authorization")] string authorization)
        {
            var user = await ValidateToken(authorization);
            if (user == null)
            {
                return Unauthorized("Invalid JWT token.");
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
        public async Task<IActionResult> UpdateUserInfo([FromHeader(Name = "Authorization")] string authorization, [FromBody] UserUpdateDto updateDto)
        {
            var user = await ValidateToken(authorization);
            if (user == null)
            {
                return Unauthorized("Invalid JWT token.");
            }

            var updateDefinition = Builders<User>.Update
                .Set(u => u.Email, updateDto.Email)
                .Set(u => u.Name, updateDto.Name)
                .Set(u => u.Username, updateDto.Username)
                .Set(u => u.Journalist, updateDto.Journalist)
                .Set(u => u.RecieveNewsletter, updateDto.RecieveNewsletter)
                .Set(u => u.AgreeWithTermsConditions, updateDto.AgreeWithTermsConditions);

            await _users.UpdateOneAsync(u => u.Id == user.Id, updateDefinition);

            return Ok(new { message = "User information updated successfully." });
        }

        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword([FromHeader(Name = "Authorization")] string authorization, [FromBody] ChangePasswordDto changePasswordDto)
        {
            var user = await ValidateToken(authorization);
            if (user == null)
            {
                return Unauthorized("Invalid JWT token.");
            }

            if (!Hashing.VerifyPassword(changePasswordDto.OldPassword, user.Password))
            {
                return Unauthorized("Old password is incorrect.");
            }

            var newPasswordHash = Hashing.HashPassword(changePasswordDto.NewPassword);
            var updateDefinition = Builders<User>.Update.Set(u => u.Password, newPasswordHash);

            await _users.UpdateOneAsync(u => u.Id == user.Id, updateDefinition);

            return Ok(new { message = "Password changed successfully." });
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteUser([FromHeader(Name = "Authorization")] string authorization)
        {
            var user = await ValidateToken(authorization);
            if (user == null)
            {
                return Unauthorized("Invalid JWT token.");
            }

            var deleteResult = await _users.DeleteOneAsync(u => u.Id == user.Id);

            if (deleteResult.DeletedCount == 0)
            {
                return NotFound("User not found.");
            }

            return Ok(new { message = "User account deleted successfully." });
        }
    }
}
