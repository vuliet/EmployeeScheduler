using EmployeeScheduler.Core.Entities;

namespace EmployeeScheduler.Core.Interfaces;

public interface IShiftRepository : IGenericRepository<Shift>
{
    Task<IEnumerable<Shift>> GetByScheduleIdAsync(Guid scheduleId);
    Task<IEnumerable<Shift>> GetByEmployeeIdAsync(Guid employeeId);
    Task<IEnumerable<Shift>> GetByDateRangeAsync(Guid tenantId, DateTime startDate, DateTime endDate);
    Task<IEnumerable<Shift>> GetByEmployeeAndDateRangeAsync(Guid employeeId, DateTime startDate, DateTime endDate);
}