using EmpCheckInOut.Api.DTOs.Leave;

namespace EmpCheckInOut.Api.Services.Interfaces
{
    public interface ILeaveRequestService
    {
        Task<LeaveRequestResponseDto> CreateAsync(string userId, LeaveRequestDto dto);
        Task<List<LeaveRequestResponseDto>> GetMyRequestsAsync(string userId);
    }
}
