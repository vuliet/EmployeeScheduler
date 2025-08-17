using AutoMapper;
using EmployeeScheduler.Application.DTOs;
using EmployeeScheduler.Core.Entities;

namespace EmployeeScheduler.Application.MappingProfiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<User, UserDto>();
        
        // Employee mappings
        CreateMap<Employee, EmployeeDto>()
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.User != null ? src.User.FirstName : ""))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.User != null ? src.User.LastName : ""))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User != null ? src.User.Email : ""));
        
        // Schedule mappings
        CreateMap<Schedule, ScheduleDto>();
        
        // Shift mappings
        CreateMap<Shift, ShiftDto>()
            .ForMember(dest => dest.EmployeeName, opt => opt.MapFrom(src => 
                src.Employee != null && src.Employee.User != null ? $"{src.Employee.User.FirstName} {src.Employee.User.LastName}" : "Unknown Employee"))
            .ForMember(dest => dest.EmployeeCode, opt => opt.MapFrom(src => src.Employee != null ? src.Employee.EmployeeCode : ""));
    }
}
