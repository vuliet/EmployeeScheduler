using AutoMapper;
using Microsoft.Extensions.Configuration;
using EmployeeScheduler.Application.DTOs;
using EmployeeScheduler.Core.Entities;
using EmployeeScheduler.Core.Enums;
using EmployeeScheduler.Core.Interfaces;

namespace EmployeeScheduler.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly ITokenService _tokenService;
    private readonly IPasswordService _passwordService;
    private readonly IEmailService _emailService;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public AuthService(
        IUserRepository userRepository,
        ITenantRepository tenantRepository,
        ITokenService tokenService,
        IPasswordService passwordService,
        IEmailService emailService,
        IMapper mapper,
        IConfiguration configuration)
    {
        _userRepository = userRepository;
        _tenantRepository = tenantRepository;
        _tokenService = tokenService;
        _passwordService = passwordService;
        _emailService = emailService;
        _mapper = mapper;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        var user = await _userRepository.GetByEmailAsync(loginDto.Email);
        if (user == null || !_passwordService.VerifyPassword(loginDto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("Account is deactivated");
        }

        if (!user.Tenant.IsActive)
        {
            throw new UnauthorizedAccessException("Tenant account is deactivated");
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);
        await _userRepository.SaveChangesAsync();

        var token = _tokenService.GenerateJwtToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();
        var expiryMinutes = int.Parse(_configuration["JWT_EXPIRY_MINUTES"] ?? "60");

        var userDto = _mapper.Map<UserDto>(user);

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            User = userDto,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes)
        };
    }

    public async Task<AuthResponseDto> RegisterTenantAsync(RegisterTenantDto registerDto)
    {
        // Check if domain already exists
        if (await _tenantRepository.DomainExistsAsync(registerDto.Domain))
        {
            throw new InvalidOperationException("Domain already exists");
        }

        // Check if email already exists
        if (await _userRepository.EmailExistsAsync(registerDto.AdminEmail))
        {
            throw new InvalidOperationException("Email already exists");
        }

        // Create tenant
        var tenant = new Tenant
        {
            Name = registerDto.TenantName,
            Domain = registerDto.Domain,
            SubscriptionType = registerDto.SubscriptionType,
            TimeZone = registerDto.TimeZone,
            Locale = registerDto.Locale,
            IsActive = true
        };

        await _tenantRepository.AddAsync(tenant);
        await _tenantRepository.SaveChangesAsync();

        // Create admin user
        var adminUser = new User
        {
            Email = registerDto.AdminEmail,
            PasswordHash = _passwordService.HashPassword(registerDto.AdminPassword),
            FirstName = registerDto.AdminFirstName,
            LastName = registerDto.AdminLastName,
            Role = UserRole.Admin,
            TenantId = tenant.Id,
            IsActive = true,
            Tenant = tenant
        };

        await _userRepository.AddAsync(adminUser);
        await _userRepository.SaveChangesAsync();

        // Send welcome email
        try
        {
            await _emailService.SendWelcomeEmailAsync(adminUser.Email, $"{adminUser.FirstName} {adminUser.LastName}");
        }
        catch
        {
            // Log email error but don't fail registration
        }

        return await LoginAsync(new LoginDto { Email = registerDto.AdminEmail, Password = registerDto.AdminPassword });
    }

    public async Task<bool> LogoutAsync(string token)
    {
        // In a real implementation, you might want to blacklist the token
        // For now, we'll just return true as JWT tokens are stateless
        await Task.CompletedTask;
        return true;
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
    {
        // In a real implementation, you would store and validate refresh tokens
        // For now, this is a placeholder
        throw new NotImplementedException("Refresh token functionality not implemented yet");
    }
}