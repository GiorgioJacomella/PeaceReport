using System.ComponentModel.DataAnnotations;

namespace PeaceReportServer.DTOs
{
    public class LoginRequestDto
    {
        [Required(ErrorMessage = "Login is required")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }


    public class LoginResponseDto
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Token { get; set; }
    }
}
