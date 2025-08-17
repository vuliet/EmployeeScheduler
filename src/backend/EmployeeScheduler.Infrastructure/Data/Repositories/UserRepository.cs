using Microsoft.EntityFrameworkCore;
using EmployeeScheduler.Core.Entities;
using EmployeeScheduler.Core.Interfaces;
using EmployeeScheduler.Infrastructure.Data;

namespace EmployeeScheduler.Infrastructure.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet
            .Include(u => u.Tenant)
            .Include(u => u.Employee)
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _dbSet.AnyAsync(u => u.Email == email);
    }

    public async Task<IEnumerable<User>> GetByTenantIdAsync(Guid tenantId)
    {
        return await _dbSet
            .Include(u => u.Employee)
            .Where(u => u.TenantId == tenantId)
            .ToListAsync();
    }
}