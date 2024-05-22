using Microsoft.AspNetCore.Mvc;
using PeaceReportServer.DTOs;
using PeaceReportServer.Services;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PeaceReportServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SignupController : ControllerBase
    {
        private readonly IUserService _userService;

        public SignupController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<ActionResult<SignupResponseDto>> Signup([FromBody] SignupRequestDto request)
        {
            if (request == null)
            {
                return BadRequest(new SignupResponseDto
                {
                    Status = "Error",
                    Message = "Request data is missing."
                });
            }

            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(request, null, null);
            bool isValid = Validator.TryValidateObject(request, validationContext, validationResults, true);

            if (!isValid)
            {
                return BadRequest(new SignupResponseDto
                {
                    Status = "Error",
                    Message = string.Join("; ", validationResults.Select(vr => vr.ErrorMessage))
                });
            }

            if (await _userService.UsernameExistsAsync(request.Username))
            {
                return Conflict(new SignupResponseDto
                {
                    Status = "Error",
                    Message = "Username already exists."
                });
            }

            if (await _userService.EmailExistsAsync(request.Email))
            {
                return Conflict(new SignupResponseDto
                {
                    Status = "Error",
                    Message = "Email already exists."
                });
            }

            await _userService.SaveSignupAsync(request);

            return Ok(new SignupResponseDto
            {
                Status = "Success",
                Message = "Signup successful."
            });
        }
    }
}
