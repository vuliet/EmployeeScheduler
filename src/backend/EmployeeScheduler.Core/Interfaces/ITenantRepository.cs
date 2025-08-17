using EmployeeScheduler.Core.Entities;

namespace EmployeeScheduler.Core.Interfaces;

public interface ITenantRepository : IGenericRepository<Tenant>
{
    Task<Tenant?> GetByDomainAsync(string domain);
    Task<bool> DomainExistsAsync(string domain);
}