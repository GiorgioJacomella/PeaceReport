using Microsoft.AspNetCore.Mvc;
using PeaceReportServer.DTOs;
using PeaceReportServer.Services;
using PeaceReportServer.Utilities;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace PeaceReportServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly ILogger<LoginController> _logger;

        public LoginController(IUserService userService, IJwtTokenService jwtTokenService, ILogger<LoginController> logger)
        {
            _userService = userService;
            _jwtTokenService = jwtTokenService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
        {
            if (request == null)
            {
                _logger.LogError("Login request is null.");
                return BadRequest(new LoginResponseDto
                {
                    Status = "Error",
                    Message = "Request data is missing."
                });
            }

            var user = await _userService.GetUserByUsernameOrEmailAsync(request.Login);
            if (user == null)
            {
                _logger.LogWarning("User not found for login: {Login}", request.Login);
                return NotFound(new LoginResponseDto
                {
                    Status = "Error",
                    Message = "User not found."
                });
            }

            bool isValidPassword = Hashing.VerifyPassword(request.Password, user.Password);
            if (!isValidPassword)
            {
                _logger.LogWarning("Invalid password for user: {Login}", request.Login);
                return Unauthorized(new LoginResponseDto
                {
                    Status = "Error",
                    Message = "Invalid password."
                });
            }

            if (string.IsNullOrEmpty(user.Id))
            {
                _logger.LogError("User ID is null or empty for user: {Login}", request.Login);
                return BadRequest(new LoginResponseDto
                {
                    Status = "Error",
                    Message = "User ID is invalid."
                });
            }

            var token = _jwtTokenService.GenerateToken(user.Id);

            user.Token = token;
            await _userService.UpdateUserTokenAsync(user.Id, token);

            return Ok(new LoginResponseDto
            {
                Status = "Success",
                Message = "Login successful.",
                Token = token
            });
        }
    }
}
