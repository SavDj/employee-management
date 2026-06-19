using EmpCheckInOut.Api.Configuration;
using EmpCheckInOut.Api.DTOs.Auth;
using EmpCheckInOut.Api.Mappers;
using EmpCheckInOut.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace EmpCheckInOut.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ITokenService _tokenService;
        private readonly JwtOptions _jwtOptions;

        public AuthController(
            IAuthService authService,
            ITokenService tokenService,
            IOptions<JwtOptions> jwtOptions)
        {
            _authService = authService;
            _tokenService = tokenService;
            _jwtOptions = jwtOptions.Value;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            var user = await _authService.LoginAsync(dto);
            var token = _tokenService.GenerateToken(user);
            SetAccessTokenCookie(token);

            return Ok(AuthMapper.MapToLoginResponse(user));
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegistrationRequestDto dto)
        {
            var user = await _authService.RegisterAsync(dto);
            var token = _tokenService.GenerateToken(user);
            SetAccessTokenCookie(token);

            return Ok(AuthMapper.MapToRegistrationResponse(user));
        }

        [HttpPost("logout")]
        [AllowAnonymous]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("AccessToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Path = "/"
            });

            return Ok(new { message = "Logged out." });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _authService.GetUserByIdAsync(userId);
            return Ok(AuthMapper.MapToLoginResponse(user));
        }

        private void SetAccessTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Path = "/",
                Expires = DateTime.UtcNow.AddMinutes(_jwtOptions.ExpireMinutes)
            };
            Response.Cookies.Append("AccessToken", token, cookieOptions);
        }
    }
}