using EmpCheckInOut.Api.Models.Enums;

namespace EmpCheckInOut.Api.DTOs.Auth
{
    public class RegistrationRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.Employee;
    }
}
