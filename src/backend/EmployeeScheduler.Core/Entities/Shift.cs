using EmployeeScheduler.Core.Enums;

namespace EmployeeScheduler.Core.Entities;

public class Shift : BaseEntity
{
    public Guid ScheduleId { get; set; }
    public Guid EmployeeId { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public ShiftType ShiftType { get; set; }
    public ShiftStatus Status { get; set; } = ShiftStatus.Scheduled;
    public string Notes { get; set; } = string.Empty;
    public bool IsOvertime { get; set; } = false;
    public TimeSpan? ActualStartTime { get; set; }
    public TimeSpan? ActualEndTime { get; set; }
    
    public virtual Schedule Schedule { get; set; } = null!;
    public virtual Employee Employee { get; set; } = null!;
}