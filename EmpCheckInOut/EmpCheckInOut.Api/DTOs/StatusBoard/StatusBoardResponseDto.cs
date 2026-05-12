using EmpCheckInOut.Api.DTOs.Manager;

namespace EmpCheckInOut.Api.DTOs.StatusBoard
{
    public class StatusBoardResponseDto
    {
        public PersonalStatusDto MyStatus { get; set; } = new();
        public List<EmployeeStatusDto> AllStatuses { get; set; } = new();
    }
}
