using EmpCheckInOut.Api.DTOs.Attendance;
using EmpCheckInOut.Api.Models;

namespace EmpCheckInOut.Api.Mappers
{
    public static class AttendanceMapper
    {
        public static AttendanceResponseDto ToDto(Attendance a) => new()
        {
            Id = a.Id,
            UserId = a.UserId,
            Date = a.Date,
            CheckIn = a.CheckIn,
            CheckOut = a.CheckOut,
            WorkMode = a.WorkMode
        };
    }
}
