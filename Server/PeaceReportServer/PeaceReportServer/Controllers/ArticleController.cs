﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using PeaceReportServer.DTOs;
using PeaceReportServer.Models;
using PeaceReportServer.Services;
using System.Collections.Generic;
using System.IO;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PeaceReportServer.Settings;

namespace PeaceReportServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly IMongoCollection<Article> _articles;
        private readonly IMongoCollection<User> _users;
        private readonly ILogger<ArticleController> _logger;
        private readonly IWebHostEnvironment _env;

        public ArticleController(IOptions<MongoDBSettings> mongoDBSettings, IMongoClient mongoClient, ILogger<ArticleController> logger, IWebHostEnvironment env)
        {
            var database = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _articles = database.GetCollection<Article>("Articles");
            _users = database.GetCollection<User>("UserData");
            _logger = logger;
            _env = env;
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

        [HttpPost]
        public async Task<IActionResult> UploadArticle([FromForm] ArticleDTO dto, [FromHeader(Name = "Authorization")] string authorization)
        {
            var user = await ValidateToken(authorization);
            if (user == null || !user.Journalist)
            {
                return Forbid("You are not authorized to create articles.");
            }

            if (dto == null || string.IsNullOrEmpty(dto.Title) || dto.ContentOrder == null || dto.Images == null || dto.Texts == null)
            {
                _logger.LogWarning("Invalid form submission.");
                return BadRequest("Invalid form submission.");
            }

            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "articleGraphics");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
                _logger.LogInformation("Uploads folder created at {UploadsFolder}.", uploadsFolder);
            }

            var contentItems = new List<ContentItem>();
            int textIndex = 0, imageIndex = 0;

            foreach (var order in dto.ContentOrder)
            {
                if (order == 0 && textIndex < dto.Texts.Count)
                {
                    contentItems.Add(new ContentItem { Type = "text", Value = dto.Texts[textIndex++] });
                }
                else if (order == 1 && imageIndex < dto.Images.Count)
                {
                    var file = dto.Images[imageIndex++];
                    if (file.Length > 0)
                    {
                        var fileName = $"{Path.GetFileNameWithoutExtension(file.FileName)}_{Path.GetRandomFileName()}{Path.GetExtension(file.FileName)}";
                        var filePath = Path.Combine(uploadsFolder, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        var fileUrl = $"{Request.Scheme}://{Request.Host}/uploads/articleGraphics/{fileName}";
                        contentItems.Add(new ContentItem { Type = "image", Value = fileUrl });
                    }
                }
            }

            var article = new Article
            {
                Title = dto.Title,
                AuthorId = user.Id,
                Content = contentItems
            };

            await _articles.InsertOneAsync(article);

            _logger.LogInformation("Article uploaded successfully by user {AuthorId}. Article ID: {ArticleId}", user.Id, article.Id);

            return Ok(new { message = "Article uploaded successfully.", articleId = article.Id.ToString() });
        }


        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> UpdateArticle(string id, [FromForm] UpdateArticleDTO dto, [FromHeader(Name = "Authorization")] string authorization)
        {
            var user = await ValidateToken(authorization);
            if (user == null)
            {
                return Forbid("You are not authorized to update articles.");
            }

            var article = await _articles.Find(a => a.Id == ObjectId.Parse(id)).FirstOrDefaultAsync();
            if (article == null)
            {
                return NotFound("Article not found.");
            }

            if (article.AuthorId != user.Id)
            {
                return Forbid("You are not authorized to update this article.");
            }

            var updates = new List<UpdateDefinition<Article>>();
            var contentItems = new List<ContentItem>();

            if (dto.Title != null)
            {
                updates.Add(Builders<Article>.Update.Set(a => a.Title, dto.Title));
            }

            if (dto.ContentOrder != null)
            {
                int textIndex = 0, imageIndex = 0;

                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "articleGraphics");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                    _logger.LogInformation("Uploads folder created at {UploadsFolder}.", uploadsFolder);
                }

                foreach (var order in dto.ContentOrder)
                {
                    if (order == 0 && dto.Texts != null && textIndex < dto.Texts.Count)
                    {
                        contentItems.Add(new ContentItem { Type = "text", Value = dto.Texts[textIndex++] });
                    }
                    else if (order == 1)
                    {
                        if (dto.Images != null && imageIndex < dto.Images.Count)
                        {
                            var file = dto.Images[imageIndex++];
                            if (file != null && file.Length > 0)
                            {
                                var fileName = $"{Path.GetFileNameWithoutExtension(file.FileName)}_{Path.GetRandomFileName()}{Path.GetExtension(file.FileName)}";
                                var filePath = Path.Combine(uploadsFolder, fileName);

                                using (var stream = new FileStream(filePath, FileMode.Create))
                                {
                                    await file.CopyToAsync(stream);
                                }

                                var fileUrl = $"{Request.Scheme}://{Request.Host}/uploads/articleGraphics/{fileName}";
                                contentItems.Add(new ContentItem { Type = "image", Value = fileUrl });
                            }
                        }
                        else if (dto.ImageUrls != null && imageIndex < dto.ImageUrls.Count)
                        {
                            contentItems.Add(new ContentItem { Type = "image", Value = dto.ImageUrls[imageIndex++] });
                        }
                    }
                }

                updates.Add(Builders<Article>.Update.Set(a => a.Content, contentItems));
            }

            if (updates.Any())
            {
                var updateDefinition = Builders<Article>.Update.Combine(updates);
                await _articles.UpdateOneAsync(a => a.Id == ObjectId.Parse(id), updateDefinition);
            }

            _logger.LogInformation("Article {ArticleId} updated successfully by user {UserId}.", id, user.Id);

            return Ok(new { message = "Article updated successfully." });
        }

        [HttpGet]
        public async Task<IActionResult> GetArticles()
        {
            var articles = await _articles.Find(_ => true).ToListAsync();
            var userIds = articles.Select(a => a.AuthorId).Distinct().ToList();
            var users = await _users.Find(u => userIds.Contains(u.Id)).ToListAsync();

            var articleDtos = articles.Select(article =>
            {
                var author = users.FirstOrDefault(u => u.Id == article.AuthorId);
                return new
                {
                    Id = article.Id.ToString(),
                    article.Title,
                    AuthorUsername = author?.Username,
                    article.Content
                };
            }).ToList();

            return Ok(articleDtos);
        }

        [HttpGet("{id:length(24)}", Name = "GetArticle")]
        public async Task<IActionResult> GetArticleById(string id)
        {
            var article = await _articles.Find(a => a.Id == ObjectId.Parse(id)).FirstOrDefaultAsync();
            if (article == null)
            {
                return NotFound();
            }

            var author = await _users.Find(u => u.Id == article.AuthorId).FirstOrDefaultAsync();
            if (author == null)
            {
                return NotFound("Author not found.");
            }

            var articleDto = new
            {
                Id = article.Id.ToString(),
                article.Title,
                AuthorUsername = author.Username,
                article.Content
            };

            return Ok(articleDto);
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> DeleteArticle(string id, [FromHeader(Name = "Authorization")] string authorization)
        {
            var user = await ValidateToken(authorization);
            if (user == null)
            {
                return Forbid("You are not authorized to delete articles.");
            }

            var article = await _articles.Find(a => a.Id == ObjectId.Parse(id)).FirstOrDefaultAsync();
            if (article == null)
            {
                return NotFound("Article not found.");
            }

            if (article.AuthorId != user.Id)
            {
                return Forbid("You are not authorized to delete this article.");
            }

            foreach (var contentItem in article.Content)
            {
                if (contentItem.Type == "image")
                {
                    var filePath = Path.Combine(_env.WebRootPath, "uploads", "articleGraphics", Path.GetFileName(contentItem.Value));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
            }

            await _articles.DeleteOneAsync(a => a.Id == ObjectId.Parse(id));

            _logger.LogInformation("Article {ArticleId} deleted successfully by user {UserId}.", id, user.Id);

            return Ok(new { message = "Article deleted successfully." });
        }
    }
}
