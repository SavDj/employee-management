using EmpCheckInOut.Api.Data;
using EmpCheckInOut.Api.DTOs.Leave;
using EmpCheckInOut.Api.Exceptions;
using EmpCheckInOut.Api.Mappers;
using EmpCheckInOut.Api.Models.Enums;
using EmpCheckInOut.Api.Services.Interfaces;
using MongoDB.Driver;

namespace EmpCheckInOut.Api.Services
{
    public class LeaveRequestService : ILeaveRequestService
    {
        private readonly MongoDbContext _db;

        public LeaveRequestService(MongoDbContext db) => _db = db;

        public async Task<LeaveRequestResponseDto> CreateAsync(string userId, LeaveRequestDto dto)
        {
            if (dto.StartDate > dto.EndDate)
                throw new BusinessRuleViolationException("Start date must be before or equal to end date.");

            if (dto.StartDate < DateTime.UtcNow.Date)
                throw new BusinessRuleViolationException("Cannot request leave for past dates.");

            var overlap = await _db.LeaveRequests.Find(lr =>
                lr.UserId == userId &&
                lr.Status == LeaveStatus.Approved &&
                lr.StartDate <= dto.EndDate.Date &&
                lr.EndDate >= dto.StartDate.Date
            ).AnyAsync();

            if (overlap)
                throw new BusinessRuleViolationException("The requested dates overlap with an existing approved leave.");

            var leave = LeaveRequestMapper.MapToModel(dto, userId);

            if (dto.LeaveType == LeaveType.Sick)
            {
                leave.Status = LeaveStatus.Approved;
                leave.ManagerDecisionDate = DateTime.UtcNow;
            }

            await _db.LeaveRequests.InsertOneAsync(leave);

            return LeaveRequestMapper.MapToDto(leave);
        }

        public async Task<List<LeaveRequestResponseDto>> GetMyRequestsAsync(string userId)
        {
            var requests = await _db.LeaveRequests
                .Find(lr => lr.UserId == userId)
                .SortByDescending(lr => lr.StartDate)
                .ToListAsync();

            return requests.Select(LeaveRequestMapper.MapToDto).ToList();
        }
    }
}