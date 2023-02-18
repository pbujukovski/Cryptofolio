using Cryptofolio.Email.Models;
using Cryptofolio.Email.Services;

namespace Cryptofolio.Services
{
    public class CryptoNotifierService : ICryptoNotifierService
    {
        private readonly IEmailService _emailService;
        public CryptoNotifierService(IEmailService emailService) {
            _emailService = emailService;
        }

        public async Task SendCryptoNotificationsAsync()
        {
            Console.WriteLine("Wooo");
            await _emailService.SendEmailAsync(new CryptoNotificationEmail("pbujukovski@gmail.com", "Crypto Notif"));

        }
    }
}
