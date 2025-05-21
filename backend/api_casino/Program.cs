using CasinoApp.Data;
using CasinoApp.Interfaces;
using CasinoApp.Repositories;
using CasinoApp.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Database config
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Dependency Injection
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<UserService>();

// CORS setup for your production frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("https://joshiidkwhy.de")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // Nur nötig, wenn Cookies/Auth verwendet werden
    });
});

// Listen on all IPs/ports inside Docker
builder.WebHost.UseUrls("http://0.0.0.0:5296");

var app = builder.Build();

// Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Casino API v1");
    c.RoutePrefix = "swagger";
});


// Middleware pipeline
//app.UseHttpsRedirection(); // Optional, nur wenn du HTTPS in Docker aktiv hast
app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.Use(async (context, next) =>
{
    Console.WriteLine($"Incoming request: {context.Request.Method} {context.Request.Path}");
    await next();
});

app.MapControllers();
app.Run();
