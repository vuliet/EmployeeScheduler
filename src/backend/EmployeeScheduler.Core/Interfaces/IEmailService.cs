namespace EmployeeScheduler.Core.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    Task SendWelcomeEmailAsync(string to, string userName);
    Task SendShiftReminderAsync(string to, string shiftDetails);
    Task SendScheduleUpdatedAsync(string to, string scheduleDetails);
}