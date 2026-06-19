using EmpCheckInOut.Api.Data;
using EmpCheckInOut.Api.DTOs.Attendance;
using EmpCheckInOut.Api.Exceptions;
using EmpCheckInOut.Api.Mappers;
using EmpCheckInOut.Api.Models;
using EmpCheckInOut.Api.Models.Enums;
using EmpCheckInOut.Api.Services.Interfaces;
using MongoDB.Driver;

namespace EmpCheckInOut.Api.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly MongoDbContext _db;

        public AttendanceService(MongoDbContext db) => _db = db;

        public async Task<AttendanceResponseDto> CheckInAsync(string userId, CheckInRequestDto dto)
        {
            var today = DateTime.UtcNow.Date;

            var approvedLeave = await _db.LeaveRequests
                .Find(lr =>
                    lr.UserId == userId &&
                    lr.Status == LeaveStatus.Approved &&
                    lr.StartDate <= today &&
                    lr.EndDate >= today)
                .AnyAsync();

            if (approvedLeave)
                throw new BusinessRuleViolationException("Cannot check in during an approved leave period.");

            var existing = await _db.Attendances
                .Find(a => a.UserId == userId && a.Date == today)
                .FirstOrDefaultAsync();

            if (existing != null)
                throw new BusinessRuleViolationException("You have already checked in today.");

            var attendance = new Attendance
            {
                UserId = userId,
                Date = today,
                CheckIn = DateTime.UtcNow,
                WorkMode = dto.WorkMode
            };

            await _db.Attendances.InsertOneAsync(attendance);

            return AttendanceMapper.ToDto(attendance);
        }

        public async Task<AttendanceResponseDto> CheckOutAsync(string userId)
        {
            var today = DateTime.UtcNow.Date;

            var attendance = await _db.Attendances
                .Find(a => a.UserId == userId && a.Date == today)
                .FirstOrDefaultAsync();

            if (attendance == null)
                throw new BusinessRuleViolationException("You have not checked in today.");

            if (attendance.CheckOut.HasValue)
                throw new BusinessRuleViolationException("You have already checked out today.");

            attendance.CheckOut = DateTime.UtcNow;
            await _db.Attendances.ReplaceOneAsync(a => a.Id == attendance.Id, attendance);

            return AttendanceMapper.ToDto(attendance);
        }
    }
}