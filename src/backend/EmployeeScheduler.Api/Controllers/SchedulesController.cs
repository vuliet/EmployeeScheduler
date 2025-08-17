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
public class SchedulesController : ControllerBase
{
    private readonly IScheduleRepository _scheduleRepository;
    private readonly IMapper _mapper;

    public SchedulesController(IScheduleRepository scheduleRepository, IMapper mapper)
    {
        _scheduleRepository = scheduleRepository;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ScheduleDto>>> GetSchedules()
    {
        var tenantId = GetTenantId();
        var schedules = await _scheduleRepository.GetByTenantIdAsync(tenantId);
        var scheduleDtos = _mapper.Map<IEnumerable<ScheduleDto>>(schedules);
        return Ok(scheduleDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ScheduleDto>> GetSchedule(Guid id)
    {
        var schedule = await _scheduleRepository.GetByIdAsync(id);
        if (schedule == null)
        {
            return NotFound();
        }

        var tenantId = GetTenantId();
        if (schedule.TenantId != tenantId)
        {
            return Forbid();
        }

        var scheduleDto = _mapper.Map<ScheduleDto>(schedule);
        return Ok(scheduleDto);
    }

    [HttpPost]
    public async Task<ActionResult<ScheduleDto>> CreateSchedule([FromBody] CreateScheduleDto createScheduleDto)
    {
        try
        {
            var tenantId = GetTenantId();
            var userId = GetUserId();

            var schedule = new Schedule
            {
                TenantId = tenantId,
                WeekStart = DateTime.SpecifyKind(createScheduleDto.WeekStart, DateTimeKind.Utc),
                WeekEnd = DateTime.SpecifyKind(createScheduleDto.WeekEnd, DateTimeKind.Utc),
                CreatedBy = userId,
                Notes = createScheduleDto.Notes,
                Status = ScheduleStatus.Draft
            };

            await _scheduleRepository.AddAsync(schedule);
            await _scheduleRepository.SaveChangesAsync();

            var scheduleDto = _mapper.Map<ScheduleDto>(schedule);
            return CreatedAtAction(nameof(GetSchedule), new { id = schedule.Id }, scheduleDto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSchedule(Guid id, [FromBody] CreateScheduleDto updateScheduleDto)
    {
        try
        {
            var schedule = await _scheduleRepository.GetByIdAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }

            var tenantId = GetTenantId();
            if (schedule.TenantId != tenantId)
            {
                return Forbid();
            }

            schedule.WeekStart = DateTime.SpecifyKind(updateScheduleDto.WeekStart, DateTimeKind.Utc);
            schedule.WeekEnd = DateTime.SpecifyKind(updateScheduleDto.WeekEnd, DateTimeKind.Utc);
            schedule.Notes = updateScheduleDto.Notes;

            await _scheduleRepository.UpdateAsync(schedule);
            await _scheduleRepository.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/publish")]
    public async Task<IActionResult> PublishSchedule(Guid id)
    {
        try
        {
            var schedule = await _scheduleRepository.GetByIdAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }

            var tenantId = GetTenantId();
            if (schedule.TenantId != tenantId)
            {
                return Forbid();
            }

            schedule.Status = ScheduleStatus.Published;
            await _scheduleRepository.UpdateAsync(schedule);
            await _scheduleRepository.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSchedule(Guid id)
    {
        try
        {
            var schedule = await _scheduleRepository.GetByIdAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }

            var tenantId = GetTenantId();
            if (schedule.TenantId != tenantId)
            {
                return Forbid();
            }

            await _scheduleRepository.DeleteAsync(schedule);
            await _scheduleRepository.SaveChangesAsync();

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

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst("nameid") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdClaim?.Value ?? throw new UnauthorizedAccessException("UserId not found in token"));
    }
}
