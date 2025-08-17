using EmployeeScheduler.Core.Entities;

namespace EmployeeScheduler.Core.Interfaces;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
    Task<IEnumerable<User>> GetByTenantIdAsync(Guid tenantId);
}