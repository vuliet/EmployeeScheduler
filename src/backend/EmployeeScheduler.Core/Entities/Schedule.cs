using EmployeeScheduler.Core.Enums;

namespace EmployeeScheduler.Core.Entities;

public class Schedule : BaseEntity
{
    public Guid TenantId { get; set; }
    public DateTime WeekStart { get; set; }
    public DateTime WeekEnd { get; set; }
    public Guid CreatedBy { get; set; }
    public ScheduleStatus Status { get; set; } = ScheduleStatus.Draft;
    public string Notes { get; set; } = string.Empty;
    
    public virtual Tenant Tenant { get; set; } = null!;
    public virtual User Creator { get; set; } = null!;
    public virtual ICollection<Shift> Shifts { get; set; } = new List<Shift>();
}