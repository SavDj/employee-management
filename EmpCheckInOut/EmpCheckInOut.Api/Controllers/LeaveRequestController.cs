using EmpCheckInOut.Api.DTOs.Leave;
using EmpCheckInOut.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmpCheckInOut.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Employee")]
    public class LeaveRequestController : ControllerBase
    {
        private readonly ILeaveRequestService _leaveRequestService;

        public LeaveRequestController(ILeaveRequestService leaveRequestService)
        {
            _leaveRequestService = leaveRequestService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LeaveRequestDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _leaveRequestService.CreateAsync(userId, dto);
            return Ok(result);
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyRequests()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var requests = await _leaveRequestService.GetMyRequestsAsync(userId);
            return Ok(requests);
        }
    }
}