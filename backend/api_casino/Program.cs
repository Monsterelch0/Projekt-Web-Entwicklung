using CasinoApp.Data;
using CasinoApp.Interfaces;
using CasinoApp.Repositories;
using CasinoApp.Services;
using Microsoft.EntityFrameworkCore;
using Prometheus;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IDeck, Deck>(); // Registriert Deck als Singleton f�r IDeck
builder.Services.AddSingleton<ICardFactory, CardFactory>(); // CardFactory kann auch Singleton oder Scoped/Transient sein


builder.Services.AddScoped<IPokerGameService, PokerGameService>();
builder.Services.AddScoped<IHandEvaluatorService, HandEvaluatorService>();
builder.Services.AddScoped<ICardFactory, CardFactory>();


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
            .WithOrigins(
                "https://joshiidkwhy.de",  // Deine Produktions-URL
                "http://localhost:5173",   // F�r Vite Dev Server (Frontend)
                "http://127.0.0.1:5173"  // F�r Vite Dev Server (Frontend, alternative Zugriffsweise)
            )
            .AllowAnyHeader()  // Erlaubt alle HTTP-Header
            .AllowAnyMethod()  // Erlaubt alle HTTP-Methoden (GET, POST, PUT, etc.)
            .AllowCredentials(); // Erlaubt das Senden von Credentials (z.B. Cookies, Authorization-Header). Vorsicht bei der Verwendung in Produktion mit nicht vertrauensw�rdigen Origins.
    });
});
// Listen on all IPs/ports inside Docker
builder.WebHost.UseUrls("http://0.0.0.0:5296");

var app = builder.Build();

// Swagger
app.UseSwagger();
app.UseSwaggerUI();


// Middleware pipeline
//app.UseHttpsRedirection(); // Optional, nur wenn du HTTPS in Docker aktiv hast
app.UseRouting();
app.UseHttpMetrics();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapMetrics();
app.Use(async (context, next) =>
{
    Console.WriteLine($"Incoming request: {context.Request.Method} {context.Request.Path}");
    await next();
});

app.MapControllers();
app.Run();
