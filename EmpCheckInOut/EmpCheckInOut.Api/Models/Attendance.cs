using EmpCheckInOut.Api.Models.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EmpCheckInOut.Api.Models
{
    public class Attendance
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; }
        public DateTime Date { get; set; }
        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }
        public WorkMode WorkMode { get; set; }
    }
}
