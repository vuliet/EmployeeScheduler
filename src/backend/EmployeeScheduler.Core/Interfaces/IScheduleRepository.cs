using EmployeeScheduler.Core.Entities;

namespace EmployeeScheduler.Core.Interfaces;

public interface IScheduleRepository : IGenericRepository<Schedule>
{
    Task<IEnumerable<Schedule>> GetByTenantIdAsync(Guid tenantId);
    Task<Schedule?> GetByWeekStartAsync(Guid tenantId, DateTime weekStart);
    Task<IEnumerable<Schedule>> GetByDateRangeAsync(Guid tenantId, DateTime startDate, DateTime endDate);
}