using Microsoft.OData.ModelBuilder;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cryptofolio.Models
{
    public class FinanceTransaction : Transaction
    {
        public float Price { get; set; }
/*
        [Expand]
        public virtual FinanceTransactionBuy FinanceTransactionBuy { get; set; }

        [Expand]
        public virtual FinanceTransactionSell FinanceTransactionSell { get; set; }*/

        /*        public int TransactionId { get; set; }

                [ForeignKey("TransactionId")]
                public Transaction Transaction { get; set; }*/
    }
}
