using EmployeeScheduler.Core.Enums;

namespace EmployeeScheduler.Application.DTOs;

public class RegisterTenantDto
{
    public string TenantName { get; set; } = string.Empty;
    public string Domain { get; set; } = string.Empty;
    public string AdminFirstName { get; set; } = string.Empty;
    public string AdminLastName { get; set; } = string.Empty;
    public string AdminEmail { get; set; } = string.Empty;
    public string AdminPassword { get; set; } = string.Empty;
    public SubscriptionType SubscriptionType { get; set; } = SubscriptionType.Free;
    public string TimeZone { get; set; } = "UTC";
    public string Locale { get; set; } = "en-US";
}