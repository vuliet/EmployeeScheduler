namespace EmployeeScheduler.Core.Entities;

public class Employee : BaseEntity
{
    public Guid UserId { get; set; }
    public string EmployeeCode { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    
    public virtual User User { get; set; } = null!;
    public virtual ICollection<Shift> Shifts { get; set; } = new List<Shift>();
}