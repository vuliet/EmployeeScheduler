using AutoMapper;
using EmployeeScheduler.Application.DTOs;
using EmployeeScheduler.Core.Entities;

namespace EmployeeScheduler.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.TenantName, opt => opt.MapFrom(src => src.Tenant.Name));

        CreateMap<Employee, EmployeeDto>()
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.User.FirstName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.User.LastName))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email));

        CreateMap<CreateEmployeeDto, User>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.TenantId, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(_ => true));

        CreateMap<CreateEmployeeDto, Employee>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore());
    }
}