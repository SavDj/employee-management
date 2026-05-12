using EmpCheckInOut.Api.DTOs.Leave;
using EmpCheckInOut.Api.Models;
using EmpCheckInOut.Api.Models.Enums;

namespace EmpCheckInOut.Api.Mappers
{
    public static class LeaveRequestMapper
    {
        public static LeaveRequestResponseDto MapToDto(LeaveRequest lr) => new()
        {
            Id = lr.Id,
            UserId = lr.UserId,
            LeaveType = lr.LeaveType.ToString(),
            StartDate = lr.StartDate,
            EndDate = lr.EndDate,
            Reason = lr.Reason,
            Status = lr.Status.ToString(),
            ManagerId = lr.ManagerId,
            ManagerDecisionDate = lr.ManagerDecisionDate,
            RejectionReason = lr.RejectionReason
        };

        public static LeaveRequest MapToModel(LeaveRequestDto dto, string userId) => new()
        {
            UserId = userId,
            LeaveType = dto.LeaveType,
            StartDate = dto.StartDate.Date,
            EndDate = dto.EndDate.Date,
            Reason = dto.Reason,
            Status = LeaveStatus.Pending,
        };
    }
}
