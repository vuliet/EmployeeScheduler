using Microsoft.EntityFrameworkCore;
using EmployeeScheduler.Core.Entities;
using EmployeeScheduler.Core.Interfaces;
using EmployeeScheduler.Infrastructure.Data;

namespace EmployeeScheduler.Infrastructure.Repositories;

public class ScheduleRepository : GenericRepository<Schedule>, IScheduleRepository
{
    public ScheduleRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<Schedule?> GetByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(s => s.Creator)
            .Include(s => s.Shifts)
            .ThenInclude(sh => sh.Employee)
            .ThenInclude(e => e.User)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<IEnumerable<Schedule>> GetByTenantIdAsync(Guid tenantId)
    {
        return await _dbSet
            .Include(s => s.Creator)
            .Include(s => s.Shifts)
            .ThenInclude(sh => sh.Employee)
            .ThenInclude(e => e.User)
            .Where(s => s.TenantId == tenantId)
            .OrderByDescending(s => s.WeekStart)
            .ToListAsync();
    }

    public async Task<Schedule?> GetByWeekStartAsync(Guid tenantId, DateTime weekStart)
    {
        var utcWeekStart = weekStart.Kind == DateTimeKind.Utc ? weekStart : DateTime.SpecifyKind(weekStart, DateTimeKind.Utc);
        return await _dbSet
            .Include(s => s.Shifts)
            .ThenInclude(sh => sh.Employee)
            .ThenInclude(e => e.User)
            .FirstOrDefaultAsync(s => s.TenantId == tenantId && s.WeekStart.Date == utcWeekStart.Date);
    }

    public async Task<IEnumerable<Schedule>> GetByDateRangeAsync(Guid tenantId, DateTime startDate, DateTime endDate)
    {
        var utcStartDate = startDate.Kind == DateTimeKind.Utc ? startDate : DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
        var utcEndDate = endDate.Kind == DateTimeKind.Utc ? endDate : DateTime.SpecifyKind(endDate, DateTimeKind.Utc);
        
        return await _dbSet
            .Include(s => s.Shifts)
            .ThenInclude(sh => sh.Employee)
            .ThenInclude(e => e.User)
            .Where(s => s.TenantId == tenantId && s.WeekStart >= utcStartDate && s.WeekEnd <= utcEndDate)
            .OrderBy(s => s.WeekStart)
            .ToListAsync();
    }
}