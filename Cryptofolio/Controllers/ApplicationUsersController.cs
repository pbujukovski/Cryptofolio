using Cryptofolio.Data;
using Cryptofolio.Models;
using Cryptofolio.Services;
using Cryptofolio.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;

namespace Cryptofolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationUsersController : ODataController
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IUserAuthService _userAuthService;

        public ApplicationUsersController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, IUserAuthService userAuthService)
        {
            _context = context;
            _userManager = userManager;
            _userAuthService = userAuthService;
        }

        // GET: api/ApplicationUsers
        [EnableQuery]
        [HttpGet("/odata/ApplicationUsers")]
        public ActionResult<List<ApplicationUserDTO>> GetApplicationUsers()
        {

            if (_userAuthService.getCurrentUserId() != null)
            {
                List<ApplicationUserDTO> applicaionUsers = _userManager.Users
                                                  .Where(au => au.Id == _userAuthService.getCurrentUserId())
                                                  .Select(user => new ApplicationUserDTO(user)).ToList();
                return Ok(applicaionUsers);
            }
            else return BadRequest();
        }

        // PUT: api/ApplicationUsers/5
        [EnableQuery]
        [HttpPut("/odata/ApplicationUsers({id})")]
        public async Task<IActionResult> PutApplicationUsers(string id, ApplicationUserDTO applicationUserViewModel)
        {
            // Step 1: Check the ID
            
            if (id != applicationUserViewModel.Id.ToString())
            {
                return BadRequest();
            }

            // Find the original 
            ApplicationUser applicationUser = await _userManager.FindByIdAsync(id);
            if (applicationUser == null)
            {
                return NotFound();
            }


            if (_userManager.Users != null)
            {

                // Check password change
                IActionResult updateResult = await updatePassword(applicationUser, applicationUserViewModel, applicationUser.Id);
                if (!(updateResult is OkResult))
                {
                    return updateResult;
                }


                // Check change of entity
                bool authorizedChanges = false;

                // Check change of the name and email
                if (applicationUser.FirstName != applicationUserViewModel.FirstName)
                {
                    applicationUser.FirstName = applicationUserViewModel.FirstName;
                    authorizedChanges = true;
                }

                // Check change of the name and email
                if (applicationUser.LastName != applicationUserViewModel.LastName)
                {
                    applicationUser.LastName = applicationUserViewModel.LastName;
                    authorizedChanges = true;
                }

                // Check change of the email/username
                if (applicationUser.Email != applicationUserViewModel.Email)
                {
                    applicationUser.Email = applicationUserViewModel.Email;
                    applicationUser.NormalizedEmail = applicationUser.Email.ToUpper();
                    //applicationUser.UserName = applicationUserViewModel.Email;
                    //applicationUser.NormalizedUserName = applicationUser.UserName.ToUpper();
                    // Use Email as username
                    authorizedChanges = true;
                }
                // Check change of the phone number
                if (applicationUser.PhoneNumber != applicationUserViewModel.PhoneNumber)
                {
                    applicationUser.PhoneNumber = applicationUserViewModel.PhoneNumber;
                    authorizedChanges = true;
                }
    
                if (authorizedChanges)
                {
                    IdentityResult identityResult = await _userManager.UpdateAsync(applicationUser);
                    if (!identityResult.Succeeded)
                    {
                        // Return BadReqest
                        return BadRequest(identityResult.Errors.Select(identiyerror => identiyerror.Description).ToList());
                    }
                }
            }

            return NoContent();
        }


        private async Task<IActionResult> updatePassword(ApplicationUser applicationUser, ApplicationUserDTO applicationUserViewModel, string userID)
        {
            // Check password change
                    if (applicationUserViewModel.Password != null && applicationUserViewModel.Password != "")
            {
                // If the ID of current User if equal then check the "old password"
                if (applicationUserViewModel.Id.ToString() == userID)
                {
                    if (!await _userManager.CheckPasswordAsync(applicationUser, applicationUserViewModel.OldPassword))
                    {
                        // Return Bad request
                        return BadRequest();
                    }
                }

                // Create Reset Password token
                string token = await _userManager.GeneratePasswordResetTokenAsync(applicationUser);
                // Set new Password
                IdentityResult identityResult = await _userManager.ResetPasswordAsync(applicationUser, token, applicationUserViewModel.Password);
                if (!identityResult.Succeeded)
                {
                    // Return BadReqest
                    return BadRequest(identityResult.Errors.Select(identiyerror => identiyerror.Description).ToList());
                }
            }
            return Ok();
        }


    }
}
