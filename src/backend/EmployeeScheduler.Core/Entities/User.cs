using EmployeeScheduler.Core.Enums;

namespace EmployeeScheduler.Core.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public Guid TenantId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }
    
    public virtual Tenant Tenant { get; set; } = null!;
    public virtual Employee? Employee { get; set; }
}