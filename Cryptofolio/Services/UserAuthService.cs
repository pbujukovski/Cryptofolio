using Cryptofolio.Data;
using Cryptofolio.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Cryptofolio.Services
{
    public class UserAuthService : IUserAuthService
    {

        UserManager<ApplicationUser> _userManager;
        IHttpContextAccessor _httpContextAccessor;
        ApplicationDbContext _applicationDbContext;
        private readonly ApplicationUser currentApplicationUser;

        public UserAuthService(ApplicationDbContext applicationDbContext, UserManager<ApplicationUser> userManager, IHttpContextAccessor httpContextAccessor)
        {
            this._userManager = userManager;
            this._httpContextAccessor = httpContextAccessor;
            this._applicationDbContext = applicationDbContext;

            //Get current user
            Task<ApplicationUser> currentUser = userManager.GetUserAsync(httpContextAccessor.HttpContext.User);

            currentUser.Wait();

            currentApplicationUser = currentUser.Result;
            
            
        }
       
        public string getCurrentUserId()
        {
            return currentApplicationUser.Id;
        }

        public string getCurrentUserName()
        {
            return currentApplicationUser.FirstName + " " + currentApplicationUser.LastName;
        }

    }
}
