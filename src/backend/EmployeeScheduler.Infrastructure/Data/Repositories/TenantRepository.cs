using Microsoft.EntityFrameworkCore;
using EmployeeScheduler.Core.Entities;
using EmployeeScheduler.Core.Interfaces;
using EmployeeScheduler.Infrastructure.Data;

namespace EmployeeScheduler.Infrastructure.Repositories;

public class TenantRepository : GenericRepository<Tenant>, ITenantRepository
{
    public TenantRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Tenant?> GetByDomainAsync(string domain)
    {
        return await _dbSet.FirstOrDefaultAsync(t => t.Domain == domain);
    }

    public async Task<bool> DomainExistsAsync(string domain)
    {
        return await _dbSet.AnyAsync(t => t.Domain == domain);
    }
}