using Microsoft.EntityFrameworkCore;
using EmployeeScheduler.Core.Entities;
using EmployeeScheduler.Core.Interfaces;
using EmployeeScheduler.Infrastructure.Data;

namespace EmployeeScheduler.Infrastructure.Repositories;

public class ShiftRepository : GenericRepository<Shift>, IShiftRepository
{
    public ShiftRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Shift>> GetByScheduleIdAsync(Guid scheduleId)
    {
        return await _dbSet
            .Include(s => s.Employee)
            .ThenInclude(e => e.User)
            .Where(s => s.ScheduleId == scheduleId)
            .OrderBy(s => s.Date)
            .ThenBy(s => s.StartTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<Shift>> GetByEmployeeIdAsync(Guid employeeId)
    {
        return await _dbSet
            .Include(s => s.Schedule)
            .Where(s => s.EmployeeId == employeeId)
            .OrderBy(s => s.Date)
            .ThenBy(s => s.StartTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<Shift>> GetByDateRangeAsync(Guid tenantId, DateTime startDate, DateTime endDate)
    {
        // Ensure DateTime parameters are treated as UTC
        var utcStartDate = startDate.Kind == DateTimeKind.Utc ? startDate : DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
        var utcEndDate = endDate.Kind == DateTimeKind.Utc ? endDate : DateTime.SpecifyKind(endDate, DateTimeKind.Utc);
        
        return await _dbSet
            .Include(s => s.Employee)
            .ThenInclude(e => e.User)
            .Include(s => s.Schedule)
            .Where(s => s.Schedule.TenantId == tenantId && s.Date >= utcStartDate && s.Date <= utcEndDate)
            .OrderBy(s => s.Date)
            .ThenBy(s => s.StartTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<Shift>> GetByEmployeeAndDateRangeAsync(Guid employeeId, DateTime startDate, DateTime endDate)
    {
        // Ensure DateTime parameters are treated as UTC
        var utcStartDate = startDate.Kind == DateTimeKind.Utc ? startDate : DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
        var utcEndDate = endDate.Kind == DateTimeKind.Utc ? endDate : DateTime.SpecifyKind(endDate, DateTimeKind.Utc);
        
        return await _dbSet
            .Include(s => s.Schedule)
            .Where(s => s.EmployeeId == employeeId && s.Date >= utcStartDate && s.Date <= utcEndDate)
            .OrderBy(s => s.Date)
            .ThenBy(s => s.StartTime)
            .ToListAsync();
    }
}