using CasinoApp.Data;
using CasinoApp.Interfaces;
using CasinoApp.Repositories;
using CasinoApp.Services;
using Microsoft.EntityFrameworkCore;
using Prometheus; // Für Metriken, okay

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// === Poker und verwandte Dienste ===
builder.Services.AddSingleton<IDeck, Deck>();
builder.Services.AddSingleton<ICardFactory, CardFactory>(); // CardFactory wird von Deck benötigt und ist zustandslos, Singleton ist gut.
builder.Services.AddScoped<IPokerGameService, PokerGameService>();
builder.Services.AddScoped<IHandEvaluatorService, HandEvaluatorService>();
// Die doppelte Registrierung von ICardFactory ist nicht nötig, eine (Singleton oder Scoped) reicht.
// Da Deck (Singleton) ICardFactory benötigt, sollte ICardFactory auch Singleton sein.

// Database config
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Andere Dependency Injections
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<UserService>();

// CORS setup
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "https://joshiidkwhy.de",
                "http://localhost:5174",
                "http://127.0.0.1:5174"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Explizit auf Port 5296 lauschen
builder.WebHost.UseUrls("http://0.0.0.0:5296");

var app = builder.Build();

// Swagger
if (app.Environment.IsDevelopment()) // Swagger idealerweise nur in Entwicklung
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware pipeline
//app.UseHttpsRedirection(); 
app.UseRouting();

// Prometheus Metriken (achte auf die Reihenfolge, oft nach Routing, vor Endpunkten)
app.UseHttpMetrics();

app.UseCors("AllowFrontend");

app.UseAuthentication(); // Falls du es später hinzufügst
app.UseAuthorization();

// Dein Custom Logging Middleware
app.Use(async (context, next) =>
{
    Console.WriteLine($"Incoming request: {context.Request.Method} {context.Request.Path}");
    await next.Invoke(); // Korrekt für .NET 6+
});

app.MapControllers();
app.MapMetrics(); // Prometheus Endpunkt

app.Run();