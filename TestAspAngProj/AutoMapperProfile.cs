using AutoMapper;
using TestAspAngProj.Models;

namespace TestAspAngProj
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserResponse>();
        }
    }
}
