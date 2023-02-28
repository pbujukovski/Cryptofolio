using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cryptofolio.Models
{
    public class Transaction
    {

        public Transaction() { }

        [Key]
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public string Note { get; set; } = string.Empty;

        public float Amount { get; set; }

        public float Fee { get; set; }

        public string ApplicationUserId { get; set; } = String.Empty;


        [ForeignKey ("ApplicationUserId")]
        public ApplicationUser? ApplicationUser { get; set; }

        public string CoinSymbol { get; set; } = string.Empty;

        [ForeignKey("CoinSymbol")]
        public Coin? Coin { get; set; }

        public ICollection<FinanceTransaction> FinanceTransactions { get; set; }

        public ICollection<TransferTransaction> TransferTransactions { get; set; }



    }
}
