using EmpCheckInOut.Api.DTOs.Leave;
using EmpCheckInOut.Api.DTOs.Manager;

namespace EmpCheckInOut.Api.Services.Interfaces
{
    public interface IManagerService
    {
        Task<List<EmployeeStatusDto>> GetAllEmployeesAsync();
        Task<EmployeeDashboardDto> GetEmployeeDashboardAsync(string employeeId);
        Task<List<LeaveRequestResponseDto>> GetPendingVacationRequestsAsync();
        Task<LeaveRequestResponseDto> ApproveVacationAsync(string leaveRequestId, string managerId);
        Task<LeaveRequestResponseDto> RejectVacationAsync(string leaveRequestId, string managerId, string rejectionReason);
    }
}
