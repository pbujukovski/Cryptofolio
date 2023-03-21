using CryptoExchange.Net.CommonObjects;
using Cryptofolio.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Cryptofolio.ViewModels
{
    public class ApplicationUserDTO
    {
        [JsonPropertyName("Id")]
        [Key]
        public Guid Id { get; set; }

        [JsonPropertyName("FirstName")]
        public string FirstName { get; set; } = string.Empty;

        [JsonPropertyName("LastName")]
        public string LastName { get; set; } = string.Empty;

        [JsonPropertyName("Email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("PhoneNumber")]
        public string PhoneNumber { get; set; } = string.Empty;

        [JsonPropertyName("Password")]
        public string Password { get; set; } = string.Empty;

        [JsonPropertyName("OldPassword")]
        public string OldPassword { get; set; } = string.Empty;

        public ApplicationUserDTO() { }

        public ApplicationUserDTO(ApplicationUserDTO applicationUserDTO) 
        {
            Id = applicationUserDTO.Id;
            FirstName = applicationUserDTO.FirstName;
            LastName = applicationUserDTO.LastName;
            Email = applicationUserDTO.Email;
            PhoneNumber = applicationUserDTO.PhoneNumber;
        }

        public ApplicationUserDTO(ApplicationUser applicationUser)
        {
            Id = new Guid(applicationUser.Id);
            FirstName = applicationUser.FirstName;
            LastName = applicationUser.LastName;
            if (applicationUser.Email != null)
            {
                Email = applicationUser.Email;
            }
            if (applicationUser.PhoneNumber != null)
            {
                PhoneNumber = applicationUser.PhoneNumber;
            }
        }

        public void convertToApplicationUser<AplicationUserType>(ref AplicationUserType applicationUser)
            where AplicationUserType : ApplicationUser
        {
            applicationUser.Id = Id.ToString();
            applicationUser.FirstName = FirstName;
            applicationUser.LastName = LastName;
            applicationUser.Email = Email;
            applicationUser.PhoneNumber = PhoneNumber;

        }
    }
}
