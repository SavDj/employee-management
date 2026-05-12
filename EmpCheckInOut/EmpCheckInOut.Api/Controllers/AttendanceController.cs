using EmpCheckInOut.Api.DTOs.Attendance;
using EmpCheckInOut.Api.Models;
using EmpCheckInOut.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmpCheckInOut.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        [HttpPost("checkin")]
        public async Task<IActionResult> CheckIn([FromBody] CheckInRequestDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            try
            {
                var result = await _attendanceService.CheckInAsync(userId, dto);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("checkout")]
        public async Task<IActionResult> CheckOut()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            try
            {
                var result = await _attendanceService.CheckOutAsync(userId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
