using EmpCheckInOut.Api.DTOs.Manager;
using EmpCheckInOut.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmpCheckInOut.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Manager")]
    public class ManagerController : ControllerBase
    {
        private readonly IManagerService _managerService;

        public ManagerController(IManagerService managerService) => _managerService = managerService;

        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees()
        {
            var employees = await _managerService.GetAllEmployeesAsync();
            return Ok(employees);
        }

        [HttpGet("employees/{id}/dashboard")]
        public async Task<IActionResult> GetEmployeeDashboard(string id)
        {
            var dashboard = await _managerService.GetEmployeeDashboardAsync(id);
            return Ok(dashboard);
        }

        [HttpGet("leaverequests/pending")]
        public async Task<IActionResult> GetPendingVacationRequests()
        {
            var pending = await _managerService.GetPendingVacationRequestsAsync();
            return Ok(pending);
        }

        [HttpPut("leaverequests/{id}/approve")]
        public async Task<IActionResult> ApproveVacation(string id)
        {
            var managerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _managerService.ApproveVacationAsync(id, managerId);
            return Ok(result);
        }

        [HttpPut("leaverequests/{id}/reject")]
        public async Task<IActionResult> RejectVacation(string id, [FromBody] RejectRequestDto dto)
        {
            var managerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _managerService.RejectVacationAsync(id, managerId, dto.RejectionReason);
            return Ok(result);
        }
    }
}