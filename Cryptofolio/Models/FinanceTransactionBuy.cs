using System.ComponentModel.DataAnnotations.Schema;

namespace Cryptofolio.Models
{
    public class FinanceTransactionBuy : FinanceTransaction
    {
        public string comment { get; set; }
    }
}
