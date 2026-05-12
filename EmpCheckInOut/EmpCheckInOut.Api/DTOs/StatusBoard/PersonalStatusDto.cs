using EmpCheckInOut.Api.Models.Enums;

namespace EmpCheckInOut.Api.DTOs.StatusBoard
{
    public class PersonalStatusDto
    {
        public string FullName { get; set; } = string.Empty;
        public EmployeeStatus Status { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
    }
}
