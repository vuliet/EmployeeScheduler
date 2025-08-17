using EmployeeScheduler.Core.Enums;

namespace EmployeeScheduler.Core.Entities;

public class ShiftTemplate : BaseEntity
{
    public Guid TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DefaultShifts { get; set; } = "{}";
    public bool IsActive { get; set; } = true;
    
    public virtual Tenant Tenant { get; set; } = null!;
}