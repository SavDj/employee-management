using EmpCheckInOut.Api.Models.Enums;

namespace EmpCheckInOut.Api.DTOs.Manager
{
    public class EmployeeStatusDto
    {
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public EmployeeStatus Status { get; set; }
        public string ProfilePictureUrl { get; set; } = string.Empty;
    }
}
