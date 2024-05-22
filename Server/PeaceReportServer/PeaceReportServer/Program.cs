using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PeaceReportServer.Services;
using PeaceReportServer.Settings;

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

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}