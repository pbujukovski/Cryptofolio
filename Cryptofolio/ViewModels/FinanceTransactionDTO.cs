using Cryptofolio.Controllers;
using Cryptofolio.Models;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.OData.ModelBuilder;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Cryptofolio.ViewModels
{
    public class FinanceTransactionDTO : TransactionDTO
    {
        [JsonPropertyName("Price")]
        public float Price { get; set; }

        public FinanceTransactionDTO() { }

        public FinanceTransactionDTO(FinanceTransactionDTO financeTransactionDTO) : base(financeTransactionDTO) 
        {
            Price = financeTransactionDTO.Price;
        }

        public FinanceTransactionDTO(FinanceTransaction financeTransaction) : base(financeTransaction) 
        {
            Price = financeTransaction.Price;
        }

        public void convertToFinanceTransaction<FinanceTransactionType>(ref FinanceTransactionType financeTransaction)
            where FinanceTransactionType : FinanceTransaction
        {
            // Convert base class
            base.convertToTransaction(ref financeTransaction);

        }

        public static Delta<FinanceTransaction> toDeltaFinanceTransaction(Delta<FinanceTransactionDTO> deltaFinanceTransactionDTO)
        {
            Delta<FinanceTransaction> deltaFinanceTransaction = ControllerUtils.convertDelta<FinanceTransactionDTO, FinanceTransaction>(deltaFinanceTransactionDTO);
            return deltaFinanceTransaction;
        }
    }
}
