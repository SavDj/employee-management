using EmpCheckInOut.Api.Models;
using EmpCheckInOut.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmpCheckInOut.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Employee")]
    public class StatusBoardController : ControllerBase
    {
        private readonly IStatusBoardService _statusBoardService;

        public StatusBoardController(IStatusBoardService statusBoardService)
        {
            _statusBoardService = statusBoardService;
        }

        [HttpGet]
        public async Task<IActionResult> GetStatusBoard()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            try
            {
                var board = await _statusBoardService.GetStatusBoardAsync(userId);
                return Ok(board);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
