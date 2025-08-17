using EmployeeScheduler.Core.Enums;

namespace EmployeeScheduler.Application.DTOs;

public class ShiftDto
{
    public Guid Id { get; set; }
    public Guid ScheduleId { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string EmployeeCode { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public ShiftType ShiftType { get; set; }
    public ShiftStatus Status { get; set; }
    public string Notes { get; set; } = string.Empty;
    public bool IsOvertime { get; set; }
    public TimeSpan? ActualStartTime { get; set; }
    public TimeSpan? ActualEndTime { get; set; }
}