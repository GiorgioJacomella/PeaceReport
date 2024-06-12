using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using PeaceReportServer.Services;
using PeaceReportServer.Settings;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.Extensions.Options;

namespace PeaceReportServer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Load Configuration from appsettings.json
            var configuration = builder.Configuration;

            // Configure MongoDB using strongly typed configuration settings.
            builder.Services.Configure<MongoDBSettings>(configuration.GetSection("MongoDB"));
            builder.Services.AddSingleton<IMongoClient>(sp =>
            {
                var settings = sp.GetRequiredService<IOptions<MongoDBSettings>>().Value;
                return new MongoClient(settings.ConnectionString);
            });

            // Configure JWT using strongly typed configuration settings.
            builder.Services.Configure<JwtConfiguration>(configuration.GetSection("JwtConfiguration"));
            builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();

            // Register UserService to make it available for dependency injection across the application.
            builder.Services.AddScoped<IUserService, UserService>();

            // Add CORS policy to allow requests from http://localhost:3000
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowLocalhost3000",
                    builder => builder.WithOrigins("http://localhost:3000")
                                      .AllowAnyMethod()
                                      .AllowAnyHeader()
                                      .AllowCredentials());
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting(); // Ensure routing is used before authentication and authorization

            // Enable CORS for the specific origin
            app.UseCors("AllowLocalhost3000");

            app.UseAuthentication(); // If you have authentication middleware
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
