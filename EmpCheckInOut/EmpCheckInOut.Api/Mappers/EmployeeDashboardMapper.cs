using EmpCheckInOut.Api.DTOs.Manager;
using EmpCheckInOut.Api.Models;

namespace EmpCheckInOut.Api.Mappers
{
    public static class EmployeeDashboardMapper
    {
        public static EmployeeDashboardDto Map(User user, int sick, int vacation, int remote, int office, string profilePictureUrl) => new()
        {
            UserId = user.Id,
            FullName = $"{user.FirstName} {user.LastName}",
            Email = user.Email,
            Department = user.Department,
            SickDaysUsed = sick,
            VacationDaysUsed = vacation,
            RemoteDays = remote,
            OfficeDays = office,
            ProfilePictureUrl = profilePictureUrl
        };
    }
}
