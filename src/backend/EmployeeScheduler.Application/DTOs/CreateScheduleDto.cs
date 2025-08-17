using EmployeeScheduler.Core.Enums;

namespace EmployeeScheduler.Application.DTOs;

public class CreateScheduleDto
{
    public DateTime WeekStart { get; set; }
    public DateTime WeekEnd { get; set; }
    public string Notes { get; set; } = string.Empty;
}