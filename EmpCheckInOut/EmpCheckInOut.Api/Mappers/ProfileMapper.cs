using EmpCheckInOut.Api.DTOs.Profile;
using EmpCheckInOut.Api.Models;

namespace EmpCheckInOut.Api.Mappers
{
    public static class ProfileMapper
    {
        public static ProfileDto MapToProfileDto(
            User user,
            int sickDaysUsed,
            int vacationDaysUsed,
            int remoteDays,
            int officeDays) => new()
            {
                UserId = user.Id,
                FullName = $"{user.FirstName} {user.LastName}",
                Email = user.Email,
                Department = user.Department,
                Phone = user.Phone,
                Address = user.Address,
                ProfilePictureUrl = user.ProfilePictureUrl,
                SickDaysUsed = sickDaysUsed,
                VacationDaysUsed = vacationDaysUsed,
                RemoteDays = remoteDays,
                OfficeDays = officeDays
            };
    }
}
