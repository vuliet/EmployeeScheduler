using Microsoft.AspNetCore.Mvc;
using EmployeeScheduler.Application.DTOs;
using EmployeeScheduler.Application.Services;

namespace EmployeeScheduler.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            var result = await _authService.LoginAsync(loginDto);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("register-tenant")]
    public async Task<ActionResult<AuthResponseDto>> RegisterTenant([FromBody] RegisterTenantDto registerDto)
    {
        try
        {
            var result = await _authService.RegisterTenantAsync(registerDto);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        var token = Request.Headers.Authorization.FirstOrDefault()?.Replace("Bearer ", "");
        if (string.IsNullOrEmpty(token))
        {
            return BadRequest(new { message = "Token is required" });
        }

        var result = await _authService.LogoutAsync(token);
        return Ok(new { message = "Logged out successfully" });
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponseDto>> RefreshToken([FromBody] string refreshToken)
    {
        try
        {
            var result = await _authService.RefreshTokenAsync(refreshToken);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
