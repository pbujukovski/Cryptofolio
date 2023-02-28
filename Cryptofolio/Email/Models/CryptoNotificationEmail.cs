namespace Cryptofolio.Email.Models
{
    public class CryptoNotificationEmail : BaseEmailDTO
    {
        public CryptoNotificationEmail(string recipient, string subject, string symbol) : base(recipient, subject)
        {
            Symbol = symbol;
        }

        public string Symbol { get; set; }

        public string Price { get; set; }

        public string AvgPrice { get; set; }


    }
}
