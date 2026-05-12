using EmpCheckInOut.Api.Models.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EmpCheckInOut.Api.Models
{
    public class LeaveRequest
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!;

        [BsonRepresentation(BsonType.String)]
        public LeaveType LeaveType { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Reason { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.String)]
        public LeaveStatus Status { get; set; }


        [BsonRepresentation(BsonType.ObjectId)]
        public string? ManagerId { get; set; }
        public DateTime? ManagerDecisionDate { get; set; }
        public string? RejectionReason { get; set; }
    }
}
