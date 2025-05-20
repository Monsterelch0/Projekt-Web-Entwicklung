# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Nur .csproj kopieren (Cache effizient nutzen)
COPY ./api.csproj ./
RUN dotnet restore ./api.csproj

# Jetzt alle Quellcodes
COPY . ./
RUN dotnet publish ./api.csproj -c Release -o /app/out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "api.dll"]
