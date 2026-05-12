using EmpCheckInOut.Api.Models.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EmpCheckInOut.Api.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public UserRole Role { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Department { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string ProfilePictureUrl { get; set; }
    }
}
