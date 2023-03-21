namespace Cryptofolio.Email.Models
{
    public class CryptoNotificationEmail : BaseEmailDTO
    {
        public CryptoNotificationEmail(string recipient, string subject, string symbol, decimal price, decimal weightedAveragePrice, decimal priceChangePercent, bool isHigher) : base(recipient, subject)
        {
            Symbol = symbol;
            Price = price;
            WeightedAveragePrice = weightedAveragePrice;
            PriceChangePercent = priceChangePercent;
            IsHigher = isHigher;
        }

        public string Symbol { get; set; }

        public decimal Price { get; set; }

        public decimal WeightedAveragePrice { get; set; }

        public decimal PriceChangePercent { get; set; }

        public bool IsHigher { get; set;  }


    }
}
