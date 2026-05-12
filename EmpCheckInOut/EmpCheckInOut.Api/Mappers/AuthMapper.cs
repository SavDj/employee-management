using EmpCheckInOut.Api.DTOs.Auth;
using EmpCheckInOut.Api.Models;
using EmpCheckInOut.Api.Models.Enums;

namespace EmpCheckInOut.Api.Mappers
{
    public static class AuthMapper
    {
        public static User MapToUser(RegistrationRequestDto dto)
        {
            return new User
            {
                Email = dto.Email.ToLower().Trim(),
                PasswordHash = null!,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Department = dto.Department,
                Role = dto.Role
            };
        }

        public static LoginResponseDto MapToLoginResponse(User user) => new()
        {
            UserId = user.Id,
            FullName = $"{user.FirstName} {user.LastName}",
            Role = user.Role.ToString()
        };

        public static RegistrationResponseDto MapToRegistrationResponse(User user) => new()
        {
            UserId = user.Id,
            Message = "Registration successful."
        };
    }
}
