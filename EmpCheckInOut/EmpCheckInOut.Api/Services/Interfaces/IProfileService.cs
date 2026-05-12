using EmpCheckInOut.Api.DTOs.Profile;

namespace EmpCheckInOut.Api.Services.Interfaces
{
    public interface IProfileService
    {
        Task<ProfileDto> GetProfileAsync(string userId);
        Task<ProfileDto> UpdateProfileAsync(string userId, UpdateProfileRequestDto dto);
    }
}
