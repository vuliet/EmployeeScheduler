using EmployeeScheduler.Core.Entities;

namespace EmployeeScheduler.Core.Interfaces;

public interface ITokenService
{
    string GenerateJwtToken(User user);
    string GenerateRefreshToken();
    bool ValidateToken(string token);
}