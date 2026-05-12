using EmpCheckInOut.Api.Models;
using MongoDB.Driver;

namespace EmpCheckInOut.Api.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IConfiguration config)
        {
            var client = new MongoClient(config["MongoDB:ConnectionString"]);
            _database = client.GetDatabase(config["MongoDB:DatabaseName"]);
        }

        public IMongoCollection<User> Users => _database.GetCollection<User>("users");
        public IMongoCollection<Attendance> Attendances => _database.GetCollection<Attendance>("attendance");
        public IMongoCollection<LeaveRequest> LeaveRequests => _database.GetCollection<LeaveRequest>("leaveRequests");
    }
}
