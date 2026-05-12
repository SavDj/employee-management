using EmpCheckInOut.Api.Data;
using EmpCheckInOut.Api.DTOs.Profile;
using EmpCheckInOut.Api.Mappers;
using EmpCheckInOut.Api.Models;
using EmpCheckInOut.Api.Models.Enums;
using EmpCheckInOut.Api.Services.Interfaces;
using MongoDB.Driver;

namespace EmpCheckInOut.Api.Services
{
    public class ProfileService : IProfileService
    {
        private readonly MongoDbContext _db;

        public ProfileService(MongoDbContext db) => _db = db;

        public async Task<ProfileDto> GetProfileAsync(string userId)
        {
            var user = await _db.Users
                .Find(u => u.Id == userId)
                .FirstOrDefaultAsync();

            if (user == null) throw new InvalidOperationException("User not found.");

            var currentYear = DateTime.UtcNow.Year;
            var startOfYear = new DateTime(currentYear, 1, 1);
            var endOfYear = new DateTime(currentYear, 12, 31);

            var attendanceFilter = Builders<Attendance>.Filter.And(
                Builders<Attendance>.Filter.Eq(a => a.UserId, userId),
                Builders<Attendance>.Filter.Gte(a => a.Date, startOfYear),
                Builders<Attendance>.Filter.Lte(a => a.Date, endOfYear)
            );
            var attendances = await _db.Attendances.Find(attendanceFilter).ToListAsync();
            var remoteDays = attendances.Count(a => a.WorkMode == WorkMode.Remote);
            var officeDays = attendances.Count(a => a.WorkMode == WorkMode.Office);

            var leaveFilter = Builders<LeaveRequest>.Filter.And(
                Builders<LeaveRequest>.Filter.Eq(l => l.UserId, userId),
                Builders<LeaveRequest>.Filter.Eq(l => l.Status, LeaveStatus.Approved)
            );
            var leaves = await _db.LeaveRequests.Find(leaveFilter).ToListAsync();
            var sickDaysUsed = leaves
                .Where(l => l.LeaveType == LeaveType.Sick)
                .Sum(l => (l.EndDate - l.StartDate).Days + 1);
            var vacationDaysUsed = leaves
                .Where(l => l.LeaveType == LeaveType.Vacation)
                .Sum(l => (l.EndDate - l.StartDate).Days + 1);

            return ProfileMapper.MapToProfileDto(user, sickDaysUsed, vacationDaysUsed, remoteDays, officeDays);
        }

        public async Task<ProfileDto> UpdateProfileAsync(string userId, UpdateProfileRequestDto dto)
        {
            var user = await _db.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null) throw new InvalidOperationException("User not found.");

            user.Address = dto.Address;
            user.Phone = dto.Phone;
            user.ProfilePictureUrl = dto.ProfilePictureUrl;

            await _db.Users.ReplaceOneAsync(u => u.Id == userId, user);

            return await GetProfileAsync(userId);
        }
    }
}
