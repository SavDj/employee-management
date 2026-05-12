using EmpCheckInOut.Api.DTOs.Attendance;

namespace EmpCheckInOut.Api.Services.Interfaces
{
    public interface IAttendanceService
    {
        Task<AttendanceResponseDto> CheckInAsync(string userId, CheckInRequestDto dto);
        Task<AttendanceResponseDto> CheckOutAsync(string userId);
    }
}
