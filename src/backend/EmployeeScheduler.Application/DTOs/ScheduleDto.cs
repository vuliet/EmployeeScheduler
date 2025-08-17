using EmployeeScheduler.Core.Enums;

namespace EmployeeScheduler.Application.DTOs;

public class ScheduleDto
{
    public Guid Id { get; set; }
    public DateTime WeekStart { get; set; }
    public DateTime WeekEnd { get; set; }
    public Guid CreatedBy { get; set; }
    public ScheduleStatus Status { get; set; }
    public string Notes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<ShiftDto> Shifts { get; set; } = new();
}