using PeaceReportServer.Models;
using PeaceReportServer.DTOs;
using System.Threading.Tasks;

namespace PeaceReportServer.Services
{
    public interface IUserService
    {
        Task<bool> UsernameExistsAsync(string username);
        Task<bool> EmailExistsAsync(string email);
        Task<User> GetUserByUsernameAsync(string username);
        Task<User> GetUserByUsernameOrEmailAsync(string identifier);
        Task SaveSignupAsync(SignupRequestDto request);
        Task UpdateUserTokenAsync(string userId, string token); // New method definition
    }
}
