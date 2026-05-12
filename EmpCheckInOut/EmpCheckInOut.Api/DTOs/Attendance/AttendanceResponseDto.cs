using EmpCheckInOut.Api.Models.Enums;

namespace EmpCheckInOut.Api.DTOs.Attendance
{
    public class AttendanceResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }
        public WorkMode WorkMode { get; set; }
    }
}
