using Cryptofolio.Controllers;
using Cryptofolio.Models;
using Microsoft.AspNetCore.OData.Deltas;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Cryptofolio.ViewModels
{
    public class FinanceTransactionDTO : TransactionDTO
    {
        [JsonPropertyName("Price")]
        public float Price { get; set; }

        [JsonPropertyName("TransactionId")]
        public int TransactionId { get; set; }

        [JsonIgnore()]
        [ForeignKey("TransactionId")]
        public Transaction Transaction { get; set; }


        public FinanceTransactionDTO() { }

        public FinanceTransactionDTO(FinanceTransactionDTO financeTransactionDTO) : base(financeTransactionDTO) 
        {
            Price = financeTransactionDTO.Price;
            TransactionId = financeTransactionDTO.TransactionId;
            if (financeTransactionDTO.Transaction != null)
            {
                Transaction = financeTransactionDTO.Transaction;
            }
        }

        public FinanceTransactionDTO(FinanceTransaction financeTransaction) : base(financeTransaction) 
        {
            Price = financeTransaction.Price;
            TransactionId = financeTransaction.TransactionId;
            if (financeTransaction.Transaction != null)
            {
                Transaction = financeTransaction.Transaction;
            }
        }

        public void convertToFinanceTransaction<FinanceTransactionType>(ref FinanceTransactionType financeTransaction)
            where FinanceTransactionType : FinanceTransaction
        {
            // Convert base class
            base.convertToTransaction(ref financeTransaction);
            financeTransaction.Price = Price;
            financeTransaction.TransactionId = TransactionId;
            if (Transaction != null)
            {
                financeTransaction.Transaction = Transaction;
            }

        }

        public static Delta<FinanceTransaction> toDeltaFinanceTransaction(Delta<FinanceTransactionDTO> deltaFinanceTransactionDTO)
        {
            Delta<FinanceTransaction> deltaFinanceTransaction = ControllerUtils.convertDelta<FinanceTransactionDTO, FinanceTransaction>(deltaFinanceTransactionDTO);
            return deltaFinanceTransaction;
        }
    }
}
