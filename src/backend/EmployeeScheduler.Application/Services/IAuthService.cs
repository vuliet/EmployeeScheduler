using EmployeeScheduler.Application.DTOs;

namespace EmployeeScheduler.Application.Services;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto> RegisterTenantAsync(RegisterTenantDto registerDto);
    Task<bool> LogoutAsync(string token);
    Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
}