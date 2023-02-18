namespace Cryptofolio.Email.Models
{
    public abstract class BaseEmailDTO
    {
        protected BaseEmailDTO(string recipient, string subject)
        {
            Recipient = recipient;
            Subject = subject;
        }

        public string Recipient { get; init; }

        public string Subject { get; init; }
    }
}
