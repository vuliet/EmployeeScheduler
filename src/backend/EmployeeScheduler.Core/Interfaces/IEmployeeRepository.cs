using EmployeeScheduler.Core.Entities;

namespace EmployeeScheduler.Core.Interfaces;

public interface IEmployeeRepository : IGenericRepository<Employee>
{
    Task<Employee?> GetByUserIdAsync(Guid userId);
    Task<Employee?> GetByEmployeeCodeAsync(string employeeCode);
    Task<IEnumerable<Employee>> GetByTenantIdAsync(Guid tenantId);
}