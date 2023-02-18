using Cryptofolio.Email.Models;
using FluentEmail.Core.Models;

namespace Cryptofolio.Email.Services
{
    public interface IEmailService
    {
        public Task<SendResponse> SendEmailAsync(BaseEmailDTO email);

    }
}
