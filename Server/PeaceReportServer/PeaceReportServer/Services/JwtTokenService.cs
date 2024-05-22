using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PeaceReportServer.Settings;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PeaceReportServer.Services
{
    public interface IJwtTokenService
    {
        string GenerateToken(string userId);
    }

    public class JwtTokenService : IJwtTokenService
    {
        private readonly JwtConfiguration _jwtConfig;

        public JwtTokenService(IOptions<JwtConfiguration> jwtConfig)
        {
            _jwtConfig = jwtConfig.Value;
        }

        /// <summary>
        /// Generate a JWT
        /// </summary>
        /// <param name="userId">Username</param>
        /// <returns>JWT</returns>
        /// <exception cref="ArgumentNullException"></exception>
        public string GenerateToken(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentNullException(nameof(userId), "User ID cannot be null or empty.");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.Secret));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _jwtConfig.Issuer,
                audience: _jwtConfig.Audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(_jwtConfig.AccessTokenExpiration),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
