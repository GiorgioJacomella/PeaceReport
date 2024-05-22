using System.Security.Cryptography;
using System.Text;

namespace PeaceReportServer.Utilities
{
    public static class Hashing
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="password">Input a Password</param>
        /// <returns>SHA256 Output</returns>
        public static string HashPassword(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="inputPassword">Client Input</param>
        /// <param name="storedHash">DB Stored Hash</param>
        /// <returns>Is Equal True or False</returns>
        public static bool VerifyPassword(string inputPassword, string storedHash)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(inputPassword));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString() == storedHash;
            }
        }
    }
}
