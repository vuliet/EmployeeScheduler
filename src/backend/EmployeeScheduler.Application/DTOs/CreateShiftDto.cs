using EmployeeScheduler.Core.Enums;

namespace EmployeeScheduler.Application.DTOs;

public class CreateShiftDto
{
    public Guid ScheduleId { get; set; }
    public Guid EmployeeId { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public ShiftType ShiftType { get; set; }
    public string Notes { get; set; } = string.Empty;
    public bool IsOvertime { get; set; } = false;
}