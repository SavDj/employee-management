using EmpCheckInOut.Api.Models;

namespace EmpCheckInOut.Api.Services.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
