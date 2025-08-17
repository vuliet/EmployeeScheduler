using Microsoft.EntityFrameworkCore;
using EmployeeScheduler.Core.Entities;
using EmployeeScheduler.Core.Interfaces;
using EmployeeScheduler.Infrastructure.Data;

namespace EmployeeScheduler.Infrastructure.Repositories;

public class EmployeeRepository : GenericRepository<Employee>, IEmployeeRepository
{
    public EmployeeRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<Employee?> GetByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(e => e.User)
            .ThenInclude(u => u.Tenant)
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<Employee?> GetByUserIdAsync(Guid userId)
    {
        return await _dbSet
            .Include(e => e.User)
            .ThenInclude(u => u.Tenant)
            .FirstOrDefaultAsync(e => e.UserId == userId);
    }

    public async Task<Employee?> GetByEmployeeCodeAsync(string employeeCode)
    {
        return await _dbSet
            .Include(e => e.User)
            .ThenInclude(u => u.Tenant)
            .FirstOrDefaultAsync(e => e.EmployeeCode == employeeCode);
    }

    public async Task<IEnumerable<Employee>> GetByTenantIdAsync(Guid tenantId)
    {
        return await _dbSet
            .Include(e => e.User)
            .Where(e => e.User.TenantId == tenantId)
            .ToListAsync();
    }
}