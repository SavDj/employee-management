using EmpCheckInOut.Api.Data;
using EmpCheckInOut.Api.DTOs.Manager;
using EmpCheckInOut.Api.DTOs.StatusBoard;
using EmpCheckInOut.Api.Exceptions;
using EmpCheckInOut.Api.Models;
using EmpCheckInOut.Api.Models.Enums;
using EmpCheckInOut.Api.Services.Interfaces;
using MongoDB.Driver;

namespace EmpCheckInOut.Api.Services;

public class StatusBoardService : IStatusBoardService
{
    private readonly MongoDbContext _db;

    public StatusBoardService(MongoDbContext db) => _db = db;

    public async Task<StatusBoardResponseDto> GetStatusBoardAsync(string currentUserId)
    {
        var today = DateTime.UtcNow.Date;

        var allUsers = await _db.Users
            .Find(u => u.Role == UserRole.Employee)
            .ToListAsync();

        var currentUser = allUsers.FirstOrDefault(u => u.Id == currentUserId);
        if (currentUser == null)
            throw new ResourceNotFoundException("User", currentUserId);

        var otherEmployees = allUsers.Where(u => u.Id != currentUserId).ToList();
        var userIds = allUsers.Select(u => u.Id).ToList();

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

        var myStatus = BuildPersonalStatus(currentUser, approvedLeaves, attendances);

        var allStatuses = otherEmployees.Select(emp =>
        {
            var status = DeriveStatus(emp.Id, approvedLeaves, attendances);
            return new EmployeeStatusDto
            {
                UserId = emp.Id,
                FullName = $"{emp.FirstName} {emp.LastName}",
                Department = emp.Department,
                Status = status
            };
        }).ToList();

        return new StatusBoardResponseDto
        {
            MyStatus = myStatus,
            AllStatuses = allStatuses
        };
    }

    private PersonalStatusDto BuildPersonalStatus(
        User user,
        List<LeaveRequest> leavePool,
        List<Attendance> attendancePool)
    {
        var dto = new PersonalStatusDto
        {
            FullName = $"{user.FirstName} {user.LastName}"
        };

        var leave = leavePool.FirstOrDefault(lr => lr.UserId == user.Id);
        if (leave != null)
        {
            dto.Status = leave.LeaveType == LeaveType.Sick
                ? EmployeeStatus.Sick
                : EmployeeStatus.Vacation;
            return dto;
        }

        var attendance = attendancePool.FirstOrDefault(a => a.UserId == user.Id);
        if (attendance != null)
        {
            dto.CheckInTime = attendance.CheckIn;
            dto.CheckOutTime = attendance.CheckOut;
            dto.Status = attendance.WorkMode == WorkMode.Office
                ? EmployeeStatus.Office
                : EmployeeStatus.Remote;
        }
        else
        {
            dto.Status = EmployeeStatus.Absent;
        }

        return dto;
    }

    private EmployeeStatus DeriveStatus(
        string userId,
        List<LeaveRequest> leavePool,
        List<Attendance> attendancePool)
    {
        var leave = leavePool.FirstOrDefault(lr => lr.UserId == userId);
        if (leave != null)
            return leave.LeaveType == LeaveType.Sick
                ? EmployeeStatus.Sick
                : EmployeeStatus.Vacation;

        var attendance = attendancePool.FirstOrDefault(a => a.UserId == userId);
        if (attendance != null)
            return attendance.WorkMode == WorkMode.Office
                ? EmployeeStatus.Office
                : EmployeeStatus.Remote;

        return EmployeeStatus.Absent;
    }
}