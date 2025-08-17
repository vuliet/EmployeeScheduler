using EmployeeScheduler.Core.Enums;

namespace EmployeeScheduler.Core.Entities;

public class Tenant : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Domain { get; set; } = string.Empty;
    public SubscriptionType SubscriptionType { get; set; }
    public string TimeZone { get; set; } = "UTC";
    public string Locale { get; set; } = "en-US";
    public string Settings { get; set; } = "{}";
    public bool IsActive { get; set; } = true;
    public DateTime? SubscriptionExpiry { get; set; }
    
    public virtual ICollection<User> Users { get; set; } = new List<User>();
    public virtual ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
    public virtual ICollection<ShiftTemplate> ShiftTemplates { get; set; } = new List<ShiftTemplate>();
}