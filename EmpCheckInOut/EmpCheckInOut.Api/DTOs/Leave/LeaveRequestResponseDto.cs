namespace EmpCheckInOut.Api.DTOs.Leave
{
    public class LeaveRequestResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string LeaveType { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? ManagerId { get; set; }
        public DateTime? ManagerDecisionDate { get; set; }
        public string? RejectionReason { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeProfilePictureUrl { get; set; } = string.Empty;
    }
}
