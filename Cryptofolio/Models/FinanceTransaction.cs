using System.ComponentModel.DataAnnotations.Schema;

namespace Cryptofolio.Models
{
    public class FinanceTransaction : Transaction
    {
        public float Price { get; set; }

        public int TransactionId { get; set; }

        [ForeignKey("TransactionId")]
        public Transaction Transaction { get; set; }
    }
}
