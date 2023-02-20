using Binance.Net.Clients;
using Cryptofolio.Email.Models;
using FluentEmail.Core;
using FluentEmail.Core.Models;

namespace Cryptofolio.Email.Services
{
    public class EmailService : IEmailService
    {
        private readonly IFluentEmail _fluentEmail;
        public EmailService(IFluentEmail fluentEmail)
        {
            _fluentEmail = fluentEmail;
        }

        public async Task<SendResponse> SendEmailAsync(BaseEmailDTO email)
        {



            SendResponse result = await _fluentEmail
                        .To(email.Recipient)
                        .Subject(email.Subject)
                        .UsingTemplateFromFile($"Email/Views/{email.GetType().Name}.cshtml", email)
                        .Tag(email.GetType().Name)
                        .SendAsync();

            return result;
        }
    }
}
