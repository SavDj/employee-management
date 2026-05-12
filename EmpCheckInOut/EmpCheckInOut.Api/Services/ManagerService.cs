using EmpCheckInOut.Api.Data;
using EmpCheckInOut.Api.DTOs.Leave;
using EmpCheckInOut.Api.DTOs.Manager;
using EmpCheckInOut.Api.Mappers;
using EmpCheckInOut.Api.Models;
using EmpCheckInOut.Api.Models.Enums;
using EmpCheckInOut.Api.Services.Interfaces;
using MongoDB.Driver;

namespace EmpCheckInOut.Api.Services
{
    public class ManagerService : IManagerService
    {
        private readonly MongoDbContext _db;

        public ManagerService(MongoDbContext db) => _db = db;

        public async Task<List<EmployeeStatusDto>> GetAllEmployeesAsync()
        {
            var users = await _db.Users.Find(u => u.Role == UserRole.Employee).ToListAsync();
            var today = DateTime.UtcNow.Date;
            var userIds = users.Select(u => u.Id).ToList();

            var approvedLeaves = await _db.LeaveRequests.Find(lr =>
                userIds.Contains(lr.UserId) &&
                lr.Status == LeaveStatus.Approved &&
                lr.StartDate <= today &&
                lr.EndDate >= today
            ).ToListAsync();

            var attendances = await _db.Attendances.Find(a =>
                userIds.Contains(a.UserId) &&
                a.Date == today
            ).ToListAsync();

            return users.Select(user =>
            {
                EmployeeStatus status;
                var leave = approvedLeaves.FirstOrDefault(lr => lr.UserId == user.Id);
                if (leave != null)
                {
                    status = leave.LeaveType == LeaveType.Sick
                        ? EmployeeStatus.Sick
                        : EmployeeStatus.Vacation;
                }
                else
                {
                    var attendance = attendances.FirstOrDefault(a => a.UserId == user.Id);
                    if (attendance != null)
                    {
                        status = attendance.WorkMode == WorkMode.Office
                            ? EmployeeStatus.Office
                            : EmployeeStatus.Remote;
                    }
                    else
                    {
                        status = EmployeeStatus.Absent;
                    }
                }

                return new EmployeeStatusDto
                {
                    UserId = user.Id,
                    FullName = $"{user.FirstName} {user.LastName}",
                    Department = user.Department,
                    Status = status
                };
            }).ToList();
        }

        public async Task<EmployeeDashboardDto> GetEmployeeDashboardAsync(string employeeId)
        {
            var user = await _db.Users.Find(u => u.Id == employeeId).FirstOrDefaultAsync();
            if (user == null) throw new InvalidOperationException("Employee not found.");

            var currentYear = DateTime.UtcNow.Year;
            var startOfYear = new DateTime(currentYear, 1, 1);
            var endOfYear = new DateTime(currentYear, 12, 31);

            var attendanceFilter = Builders<Attendance>.Filter.And(
                Builders<Attendance>.Filter.Eq(a => a.UserId, employeeId),
                Builders<Attendance>.Filter.Gte(a => a.Date, startOfYear),
                Builders<Attendance>.Filter.Lte(a => a.Date, endOfYear)
            );
            var attendances = await _db.Attendances.Find(attendanceFilter).ToListAsync();
            var remoteDays = attendances.Count(a => a.WorkMode == WorkMode.Remote);
            var officeDays = attendances.Count(a => a.WorkMode == WorkMode.Office);

            var leaveFilter = Builders<LeaveRequest>.Filter.And(
                Builders<LeaveRequest>.Filter.Eq(l => l.UserId, employeeId),
                Builders<LeaveRequest>.Filter.Eq(l => l.Status, LeaveStatus.Approved)
            );
            var leaves = await _db.LeaveRequests.Find(leaveFilter).ToListAsync();
            var sickDaysUsed = leaves.Where(l => l.LeaveType == LeaveType.Sick)
                                     .Sum(l => (l.EndDate - l.StartDate).Days + 1);
            var vacationDaysUsed = leaves.Where(l => l.LeaveType == LeaveType.Vacation)
                                         .Sum(l => (l.EndDate - l.StartDate).Days + 1);

            return EmployeeDashboardMapper.Map(user, sickDaysUsed, vacationDaysUsed, remoteDays, officeDays);
        }

        public async Task<List<LeaveRequestResponseDto>> GetPendingVacationRequestsAsync()
        {
            var pending = await _db.LeaveRequests.Find(lr =>
                lr.LeaveType == LeaveType.Vacation &&
                lr.Status == LeaveStatus.Pending
            ).SortBy(lr => lr.StartDate).ToListAsync();

            return pending.Select(LeaveRequestMapper.MapToDto).ToList();
        }

        public async Task<LeaveRequestResponseDto> ApproveVacationAsync(string leaveRequestId, string managerId)
        {
            var leave = await _db.LeaveRequests.Find(lr => lr.Id == leaveRequestId).FirstOrDefaultAsync();
            if (leave == null) throw new InvalidOperationException("Leave request not found.");
            if (leave.LeaveType != LeaveType.Vacation || leave.Status != LeaveStatus.Pending)
                throw new InvalidOperationException("Only pending vacation requests can be approved.");

            leave.Status = LeaveStatus.Approved;
            leave.ManagerId = managerId;
            leave.ManagerDecisionDate = DateTime.UtcNow;
            leave.RejectionReason = null;

            await _db.LeaveRequests.ReplaceOneAsync(lr => lr.Id == leave.Id, leave);
            return LeaveRequestMapper.MapToDto(leave);
        }

        public async Task<LeaveRequestResponseDto> RejectVacationAsync(string leaveRequestId, string managerId, string rejectionReason)
        {
            var leave = await _db.LeaveRequests.Find(lr => lr.Id == leaveRequestId).FirstOrDefaultAsync();
            if (leave == null) throw new InvalidOperationException("Leave request not found.");
            if (leave.LeaveType != LeaveType.Vacation || leave.Status != LeaveStatus.Pending)
                throw new InvalidOperationException("Only pending vacation requests can be rejected.");

            leave.Status = LeaveStatus.Rejected;
            leave.ManagerId = managerId;
            leave.ManagerDecisionDate = DateTime.UtcNow;
            leave.RejectionReason = rejectionReason;

            await _db.LeaveRequests.ReplaceOneAsync(lr => lr.Id == leave.Id, leave);
            return LeaveRequestMapper.MapToDto(leave);
        }
    }
}
