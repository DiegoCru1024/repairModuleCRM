using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Contracts.User.DTOs;
using Application.Exceptions;
using Application.Services.Interfaces;
using AutoMapper;
using Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Identity.Services;

public class UserService: IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IMapper _mapper;
    private readonly IValidationObjectService _validationObjectService;
    private readonly IConfiguration _configuration;

        public UserService(UserManager<User> userManager, SignInManager<User> signInManager, IMapper mapper, IConfiguration configuration, IValidationObjectService validationObjectService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _mapper = mapper;
        _configuration = configuration;
        _validationObjectService = validationObjectService;
    }

    public async Task<UserToken> CreateUser(RegisterUser model)
    {
        _validationObjectService.EnsureValid(model);

        var user = await _userManager.FindByEmailAsync(model.Email);

        if (user != null)
        {
            throw new AppException("El usuario ya existe");
        }

        var newUser = _mapper.Map<User>(model);

        var result = await _userManager.CreateAsync(newUser, model.Password);

        if (!result.Succeeded)
        {
            throw new Exception(result.Errors.ToString());
        }

        await _userManager.AddToRoleAsync(newUser, model.Role);

        return GenerateJwtToken(newUser, model.Role);

    }

    public async Task<UserToken> LoginUser(LoginUser model)
    {
        _validationObjectService.EnsureValid(model);

        var user = await _userManager.FindByEmailAsync(model.Email);

        if(user == null)
            throw new AppException("El usuario no existe");

        var loginResult = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, true);

        if (!loginResult.Succeeded)
            throw new AppException("Verifique sus credenciales");

        var userRoles = await _userManager.GetRolesAsync(user);

        return GenerateJwtToken(user, userRoles.FirstOrDefault());
    }
    private UserToken GenerateJwtToken(User user, string? role)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, $"{user.Name} {user.Surname}"),
        };

        if (role != null)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!));

        var token = new JwtSecurityToken(
            null,
            null,
            claims,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new UserToken(new JwtSecurityTokenHandler().WriteToken(token));
    }
}
