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
public class ShiftsController : ControllerBase
{
    private readonly IShiftRepository _shiftRepository;
    private readonly IScheduleRepository _scheduleRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    public ShiftsController(
        IShiftRepository shiftRepository,
        IScheduleRepository scheduleRepository,
        IEmployeeRepository employeeRepository,
        IMapper mapper)
    {
        _shiftRepository = shiftRepository;
        _scheduleRepository = scheduleRepository;
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShiftDto>>> GetShifts([FromQuery] Guid? scheduleId = null)
    {
        var tenantId = GetTenantId();
        
        IEnumerable<Shift> shifts;
        if (scheduleId.HasValue)
        {
            shifts = await _shiftRepository.GetByScheduleIdAsync(scheduleId.Value);
        }
        else
        {
            // Get shifts by date range for the current week as fallback
            var startOfWeek = DateTime.SpecifyKind(DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek), DateTimeKind.Utc);
            var endOfWeek = DateTime.SpecifyKind(startOfWeek.AddDays(7), DateTimeKind.Utc);
            shifts = await _shiftRepository.GetByDateRangeAsync(tenantId, startOfWeek, endOfWeek);
        }

        var shiftDtos = _mapper.Map<IEnumerable<ShiftDto>>(shifts);
        return Ok(shiftDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ShiftDto>> GetShift(Guid id)
    {
        var shift = await _shiftRepository.GetByIdAsync(id);
        if (shift == null)
        {
            return NotFound();
        }

        var tenantId = GetTenantId();
        if (shift.Schedule.TenantId != tenantId)
        {
            return Forbid();
        }

        var shiftDto = _mapper.Map<ShiftDto>(shift);
        return Ok(shiftDto);
    }

    [HttpPost]
    public async Task<ActionResult<ShiftDto>> CreateShift([FromBody] CreateShiftDto createShiftDto)
    {
        try
        {
            // Validate input
            if (createShiftDto == null)
            {
                return BadRequest(new { message = "Invalid shift data" });
            }

            var tenantId = GetTenantId();

            // Verify schedule belongs to tenant
            var schedule = await _scheduleRepository.GetByIdAsync(createShiftDto.ScheduleId);
            if (schedule == null)
            {
                return BadRequest(new { message = "Schedule not found" });
            }
            
            if (schedule.TenantId != tenantId)
            {
                return BadRequest(new { message = "Schedule does not belong to your organization" });
            }

            // Verify employee belongs to tenant
            var employee = await _employeeRepository.GetByIdAsync(createShiftDto.EmployeeId);
            if (employee == null)
            {
                return BadRequest(new { message = "Employee not found" });
            }
            
            if (employee.User?.TenantId == null)
            {
                return BadRequest(new { message = "Employee user data not found" });
            }
            
            if (employee.User.TenantId != tenantId)
            {
                return BadRequest(new { message = "Employee does not belong to your organization" });
            }

            var shift = new Shift
            {
                ScheduleId = createShiftDto.ScheduleId,
                EmployeeId = createShiftDto.EmployeeId,
                Date = createShiftDto.Date.Kind == DateTimeKind.Utc 
                    ? createShiftDto.Date 
                    : DateTime.SpecifyKind(createShiftDto.Date.Date, DateTimeKind.Utc),
                StartTime = createShiftDto.StartTime,
                EndTime = createShiftDto.EndTime,
                ShiftType = createShiftDto.ShiftType,
                Notes = createShiftDto.Notes ?? string.Empty,
                IsOvertime = createShiftDto.IsOvertime,
                Status = ShiftStatus.Scheduled
            };

            await _shiftRepository.AddAsync(shift);
            await _shiftRepository.SaveChangesAsync();

            var shiftDto = _mapper.Map<ShiftDto>(shift);
            if (shiftDto == null)
            {
                return StatusCode(500, new { message = "Failed to map shift data" });
            }

            return CreatedAtAction(nameof(GetShift), new { id = shift.Id }, shiftDto);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = $"Invalid argument: {ex.Message}" });
        }
        catch (Exception ex)
        {
            // Log the full exception for debugging
            Console.WriteLine($"CreateShift error: {ex}");
            return StatusCode(500, new { message = "An error occurred while creating the shift", details = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateShift(Guid id, [FromBody] CreateShiftDto updateShiftDto)
    {
        try
        {
            var shift = await _shiftRepository.GetByIdAsync(id);
            if (shift == null)
            {
                return NotFound();
            }

            var tenantId = GetTenantId();
            if (shift.Schedule.TenantId != tenantId)
            {
                return Forbid();
            }

            shift.Date = updateShiftDto.Date.Kind == DateTimeKind.Utc 
                ? updateShiftDto.Date 
                : DateTime.SpecifyKind(updateShiftDto.Date.Date, DateTimeKind.Utc);
            shift.StartTime = updateShiftDto.StartTime;
            shift.EndTime = updateShiftDto.EndTime;
            shift.ShiftType = updateShiftDto.ShiftType;
            shift.Notes = updateShiftDto.Notes;
            shift.IsOvertime = updateShiftDto.IsOvertime;

            await _shiftRepository.UpdateAsync(shift);
            await _shiftRepository.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateShiftStatus(Guid id, [FromBody] ShiftStatus status)
    {
        try
        {
            var shift = await _shiftRepository.GetByIdAsync(id);
            if (shift == null)
            {
                return NotFound();
            }

            var tenantId = GetTenantId();
            if (shift.Schedule.TenantId != tenantId)
            {
                return Forbid();
            }

            shift.Status = status;
            await _shiftRepository.UpdateAsync(shift);
            await _shiftRepository.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteShift(Guid id)
    {
        try
        {
            var shift = await _shiftRepository.GetByIdAsync(id);
            if (shift == null)
            {
                return NotFound();
            }

            var tenantId = GetTenantId();
            if (shift.Schedule.TenantId != tenantId)
            {
                return Forbid();
            }

            await _shiftRepository.DeleteAsync(shift);
            await _shiftRepository.SaveChangesAsync();

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
