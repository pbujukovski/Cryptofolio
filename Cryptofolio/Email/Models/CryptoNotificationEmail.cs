namespace Cryptofolio.Email.Models
{
    public class CryptoNotificationEmail : BaseEmailDTO
    {
        public CryptoNotificationEmail(string recipient, string subject) : base(recipient, subject)
        {
        }
    }
}
