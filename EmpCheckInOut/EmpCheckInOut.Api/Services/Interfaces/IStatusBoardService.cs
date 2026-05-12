using EmpCheckInOut.Api.DTOs.StatusBoard;

namespace EmpCheckInOut.Api.Services.Interfaces
{
    public interface IStatusBoardService
    {
        Task<StatusBoardResponseDto> GetStatusBoardAsync(string currentUserId);
    }
}
