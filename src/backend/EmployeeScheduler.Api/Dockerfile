FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files
COPY ["EmployeeScheduler.Api/EmployeeScheduler.Api.csproj", "EmployeeScheduler.Api/"]
COPY ["EmployeeScheduler.Application/EmployeeScheduler.Application.csproj", "EmployeeScheduler.Application/"]
COPY ["EmployeeScheduler.Infrastructure/EmployeeScheduler.Infrastructure.csproj", "EmployeeScheduler.Infrastructure/"]
COPY ["EmployeeScheduler.Core/EmployeeScheduler.Core.csproj", "EmployeeScheduler.Core/"]

# Restore dependencies
RUN dotnet restore "EmployeeScheduler.Api/EmployeeScheduler.Api.csproj"

# Copy all source code
COPY . .

# Build the application
WORKDIR "/src/EmployeeScheduler.Api"
RUN dotnet build "EmployeeScheduler.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EmployeeScheduler.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EmployeeScheduler.Api.dll"]