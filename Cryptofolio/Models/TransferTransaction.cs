using System.ComponentModel.DataAnnotations.Schema;

namespace Cryptofolio.Models
{
    public class TransferTransaction : Transaction
    {
        public int TransactionId { get; set; }

        [ForeignKey("TransactionId")]
        public Transaction Transaction { get; set; }
    }
}
