namespace EmpCheckInOut.Api.DTOs.Profile
{
    public class UpdateProfileRequestDto
    {
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ProfilePictureUrl { get; set; } = string.Empty;
    }
}
