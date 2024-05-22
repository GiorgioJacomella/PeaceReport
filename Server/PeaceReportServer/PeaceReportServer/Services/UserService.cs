using MongoDB.Driver;
using Microsoft.Extensions.Options;
using PeaceReportServer.Settings;
using PeaceReportServer.Models;
using PeaceReportServer.DTOs;
using System.Threading.Tasks;
using PeaceReportServer.Utilities;

namespace PeaceReportServer.Services
{
    public class UserService : IUserService
    {
        private readonly IMongoCollection<User> _usersCollection;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="mongoDBSettings">MongoDBSettings</param>
        /// <param name="mongoClient">MongoDB Client</param>
        public UserService(IOptions<MongoDBSettings> mongoDBSettings, IMongoClient mongoClient)
        {
            var mongoDatabase = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _usersCollection = mongoDatabase.GetCollection<User>("UserData");
        }

        /// <summary>
        /// Check if a Username already Exists
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>Exists True or False</returns>
        public async Task<bool> UsernameExistsAsync(string username)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Username, username);
            return await _usersCollection.CountDocumentsAsync(filter) > 0;
        }

        /// <summary>
        /// Check if an Email Already Exists
        /// </summary>
        /// <param name="email">Email</param>
        /// <returns>Exists True or False</returns>
        public async Task<bool> EmailExistsAsync(string email)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Email, email);
            return await _usersCollection.CountDocumentsAsync(filter) > 0;
        }

        /// <summary>
        /// Get user By the Username
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>User informations</returns>
        public async Task<User> GetUserByUsernameAsync(string username)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Username, username);
            return await _usersCollection.Find(filter).FirstOrDefaultAsync();
        }

        /// <summary>
        /// Get user By the Email
        /// </summary>
        /// <param name="identifier">Email</param>
        /// <returns>User Informations</returns>
        public async Task<User> GetUserByUsernameOrEmailAsync(string identifier)
        {
            var builder = Builders<User>.Filter;
            var filter = builder.Eq(u => u.Username, identifier) | builder.Eq(u => u.Email, identifier);
            return await _usersCollection.Find(filter).FirstOrDefaultAsync();
        }


        /// <summary>
        /// Signup a new User
        /// </summary>
        /// <param name="request">Client User data Input</param>
        /// <returns></returns>
        public async Task SaveSignupAsync(SignupRequestDto request)
        {
            var user = new User
            {
                Email = request.Email,
                Name = request.Name,
                Username = request.Username,
                Password = Hashing.HashPassword(request.Password),
                Journalist = request.Journalist,
                RecieveNewsletter = request.RecieveNewsletter,
                AgreeWithTermsConditions = request.AgreeWithTermsConditions
            };
            await _usersCollection.InsertOneAsync(user);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="userId">User ID from MongoDB</param>
        /// <param name="token">Generater JWT</param>
        /// <returns></returns>
        public async Task UpdateUserTokenAsync(string userId, string token)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
            var update = Builders<User>.Update.Set(u => u.Token, token);
            await _usersCollection.UpdateOneAsync(filter, update);
        }
    }
}
