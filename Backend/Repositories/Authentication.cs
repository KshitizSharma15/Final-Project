using System.Security.Claims;
using System.Text;
using CogniProject.Data;
using CogniProject.Exceptions;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace CogniProject.Repositories
{
    public class Authentication : IAuthentication
    {
        private readonly ContextDb _context;
        private readonly string _key;
        public Authentication(ContextDb context, string key)
        {
            _context = context;
            _key = key;
        }
        public string AuthenticationUser(string Email, string password)
        {
            var result = _context.Employees.Where(e => e.EmployeeEmail == Email && e.Password == password).FirstOrDefault();
            if (result == null)
            {
                throw new NotFoundException("User Not Found");
            }
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.ASCII.GetBytes(_key);
            var role = result.Role;
            var userName = $"{result.EmployeeName}";

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(
                    new Claim[]
                    {
                        new Claim(ClaimTypes.Email,Email),
                        new Claim(ClaimTypes.Role,role),
                        new Claim("employeeId", result.EmployeeID.ToString()),
                        new Claim(ClaimTypes.Name, userName), // Keep this for now, and also add the full URI
                        new Claim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name", userName)
                        //new Claim(ClaimTypes.Password,password)
                    }),
                Expires = DateTime.UtcNow.AddHours(999), ///////////////////////////////////////////////////////// Change
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);

        }

    }
}
