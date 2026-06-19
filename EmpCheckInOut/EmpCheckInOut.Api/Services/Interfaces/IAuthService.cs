using EmpCheckInOut.Api.DTOs;
using EmpCheckInOut.Api.DTOs.Auth;
using EmpCheckInOut.Api.Models;

namespace EmpCheckInOut.Api.Services.Interfaces
{
    public interface IAuthService
    {
        Task<User> LoginAsync(LoginRequestDto dto);
        Task<User> RegisterAsync(RegistrationRequestDto dto);
        Task<User> GetUserByIdAsync(string userId);
    }
}
