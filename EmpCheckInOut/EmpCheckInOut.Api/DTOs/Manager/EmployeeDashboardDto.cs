namespace EmpCheckInOut.Api.DTOs.Manager
{
    public class EmployeeDashboardDto
    {
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public int SickDaysUsed { get; set; }
        public int VacationDaysUsed { get; set; }
        public int RemoteDays { get; set; }
        public int OfficeDays { get; set; }
    }
}
