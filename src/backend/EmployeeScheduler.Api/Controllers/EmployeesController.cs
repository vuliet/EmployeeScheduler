using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EmployeeScheduler.Application.DTOs;
using EmployeeScheduler.Core.Interfaces;
using EmployeeScheduler.Core.Entities;
using EmployeeScheduler.Core.Enums;
using AutoMapper;

namespace EmployeeScheduler.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordService _passwordService;
    private readonly IMapper _mapper;

    public EmployeesController(
        IEmployeeRepository employeeRepository,
        IUserRepository userRepository,
        IPasswordService passwordService,
        IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
        _passwordService = passwordService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetEmployees()
    {
        var tenantId = GetTenantId();
        var employees = await _employeeRepository.GetByTenantIdAsync(tenantId);
        var employeeDtos = _mapper.Map<IEnumerable<EmployeeDto>>(employees);
        return Ok(employeeDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EmployeeDto>> GetEmployee(Guid id)
    {
        var employee = await _employeeRepository.GetByIdAsync(id);
        if (employee == null)
        {
            return NotFound();
        }

        // Check if employee belongs to the same tenant
        var tenantId = GetTenantId();
        if (employee.User.TenantId != tenantId)
        {
            return Forbid();
        }

        var employeeDto = _mapper.Map<EmployeeDto>(employee);
        return Ok(employeeDto);
    }

    [HttpPost]
    public async Task<ActionResult<EmployeeDto>> CreateEmployee([FromBody] CreateEmployeeDto createEmployeeDto)
    {
        try
        {
            var tenantId = GetTenantId();

            // Check if email already exists
            if (await _userRepository.EmailExistsAsync(createEmployeeDto.Email))
            {
                return BadRequest(new { message = "Email already exists" });
            }

            // Create user first
            var user = new User
            {
                Email = createEmployeeDto.Email,
                FirstName = createEmployeeDto.FirstName,
                LastName = createEmployeeDto.LastName,
                Role = createEmployeeDto.Role,
                TenantId = tenantId,
                IsActive = true,
                PasswordHash = _passwordService.HashPassword("TempPassword123!") // Default password
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            // Create employee
            var employee = new Employee
            {
                UserId = user.Id,
                EmployeeCode = createEmployeeDto.EmployeeCode,
                Department = createEmployeeDto.Department,
                Position = createEmployeeDto.Position,
                HireDate = DateTime.SpecifyKind(createEmployeeDto.HireDate, DateTimeKind.Utc),
                PhoneNumber = createEmployeeDto.PhoneNumber,
                Address = createEmployeeDto.Address
            };

            await _employeeRepository.AddAsync(employee);
            await _employeeRepository.SaveChangesAsync();

            var employeeDto = _mapper.Map<EmployeeDto>(employee);
            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employeeDto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEmployee(Guid id, [FromBody] CreateEmployeeDto updateEmployeeDto)
    {
        try
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            var tenantId = GetTenantId();
            if (employee.User.TenantId != tenantId)
            {
                return Forbid();
            }

            // Update employee data
            employee.EmployeeCode = updateEmployeeDto.EmployeeCode;
            employee.Department = updateEmployeeDto.Department;
            employee.Position = updateEmployeeDto.Position;
            employee.HireDate = DateTime.SpecifyKind(updateEmployeeDto.HireDate, DateTimeKind.Utc);
            employee.PhoneNumber = updateEmployeeDto.PhoneNumber;
            employee.Address = updateEmployeeDto.Address;

            // Update user data
            employee.User.FirstName = updateEmployeeDto.FirstName;
            employee.User.LastName = updateEmployeeDto.LastName;
            employee.User.Email = updateEmployeeDto.Email;
            employee.User.Role = updateEmployeeDto.Role;

            await _employeeRepository.UpdateAsync(employee);
            await _employeeRepository.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEmployee(Guid id)
    {
        try
        {
            var employee = await _employeeRepository.GetByIdAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            var tenantId = GetTenantId();
            if (employee.User.TenantId != tenantId)
            {
                return Forbid();
            }

            await _employeeRepository.DeleteAsync(employee);
            await _employeeRepository.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private Guid GetTenantId()
    {
        var tenantIdClaim = User.FindFirst("TenantId");
        return Guid.Parse(tenantIdClaim?.Value ?? throw new UnauthorizedAccessException("TenantId not found in token"));
    }
}
