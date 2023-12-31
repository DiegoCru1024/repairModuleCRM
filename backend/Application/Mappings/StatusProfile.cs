using Application.Contracts.Status.DTOs;
using AutoMapper;
using Domain.Base;
using Domain.Entities;

namespace Application.Mappings;

public class StatusProfile : Profile
{
    public StatusProfile()
    {
        CreateMap<Status, GetStatus>();
    }
}