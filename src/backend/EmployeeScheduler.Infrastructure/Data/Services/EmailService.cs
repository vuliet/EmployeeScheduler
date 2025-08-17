using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using EmployeeScheduler.Core.Interfaces;

namespace EmployeeScheduler.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var smtpHost = _configuration["SMTP_HOST"] ?? "smtp.gmail.com";
        var smtpPort = int.Parse(_configuration["SMTP_PORT"] ?? "587");
        var smtpUsername = _configuration["SMTP_USERNAME"] ?? "";
        var smtpPassword = _configuration["SMTP_PASSWORD"] ?? "";

        using var client = new SmtpClient(smtpHost, smtpPort)
        {
            EnableSsl = true,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(smtpUsername, smtpPassword)
        };

        var message = new MailMessage
        {
            From = new MailAddress(smtpUsername, "Employee Scheduler"),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };
        message.To.Add(to);

        await client.SendMailAsync(message);
    }

    public async Task SendWelcomeEmailAsync(string to, string userName)
    {
        var subject = "Welcome to Employee Scheduler";
        var body = $@"
            <h2>Welcome to Employee Scheduler, {userName}!</h2>
            <p>Your account has been successfully created.</p>
            <p>You can now log in to the system and manage your schedule.</p>
            <p>Best regards,<br>Employee Scheduler Team</p>
        ";

        await SendEmailAsync(to, subject, body);
    }

    public async Task SendShiftReminderAsync(string to, string shiftDetails)
    {
        var subject = "Shift Reminder - Employee Scheduler";
        var body = $@"
            <h2>Shift Reminder</h2>
            <p>This is a reminder about your upcoming shift:</p>
            <p>{shiftDetails}</p>
            <p>Best regards,<br>Employee Scheduler Team</p>
        ";

        await SendEmailAsync(to, subject, body);
    }

    public async Task SendScheduleUpdatedAsync(string to, string scheduleDetails)
    {
        var subject = "Schedule Updated - Employee Scheduler";
        var body = $@"
            <h2>Schedule Update</h2>
            <p>Your schedule has been updated:</p>
            <p>{scheduleDetails}</p>
            <p>Please check the system for the latest changes.</p>
            <p>Best regards,<br>Employee Scheduler Team</p>
        ";

        await SendEmailAsync(to, subject, body);
    }
}