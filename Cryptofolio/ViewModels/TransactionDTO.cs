using Cryptofolio.Controllers;
using Cryptofolio.Models;
using Microsoft.AspNetCore.OData.Deltas;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Cryptofolio.ViewModels
{
    public class TransactionDTO
    {
        [Key]
        [JsonPropertyName("Id")]
        public int Id { get; set; }

        [JsonPropertyName("Date")]
        public DateTime Date { get; set; }

        [JsonPropertyName("Note")]
        public string Note { get; set; } = string.Empty;

        [JsonPropertyName("Amount")]
        public float Amount { get; set; }

        [JsonPropertyName("Fee")]
        public float Fee { get; set; }

        [JsonPropertyName("ApplicationUserId")]
        public string ApplicationUserId { get; set; } = String.Empty;


        [ForeignKey("ApplicationUserId")]
        [JsonIgnore]
        public ApplicationUserDTO? ApplicationUser { get; set; }

        [JsonPropertyName("CoinSymbol")]
        public string CoinSymbol { get; set; } = string.Empty;

        [ForeignKey("CoinSymbol")]
        [JsonIgnore]
        public CoinDTO? Coin { get; set; }


        public TransactionDTO() { }

        public TransactionDTO(TransactionDTO transactionDTO)
        {
            Id = transactionDTO.Id;
            Date = transactionDTO.Date;
            Note = transactionDTO.Note;
            Amount = transactionDTO.Amount;
            Fee = transactionDTO.Fee;
            ApplicationUserId = transactionDTO.ApplicationUserId;
            CoinSymbol = transactionDTO.CoinSymbol;
        }

        public TransactionDTO(Transaction transaction)
        {
            Id = transaction.Id;
            Date = transaction.Date;
            Note = transaction.Note;
            Amount = transaction.Amount;
            Fee = transaction.Fee;
            ApplicationUserId = transaction.ApplicationUserId;
            CoinSymbol = transaction.CoinSymbol;
        }

        public void convertToTransaction<TransactionType>(ref TransactionType transaction) where TransactionType : Transaction
        {
            transaction.Id = Id;
            transaction.Date = Date;
            transaction.Note = Note;
            transaction.Amount = Amount;
            transaction.Fee = Fee;
            transaction.ApplicationUserId = ApplicationUserId;
            transaction.CoinSymbol = CoinSymbol;

        }

        public static Delta<Transaction> toDeltaTransaction(Delta<TransactionDTO> deltaTransactionDTO)
        {
            Delta<Transaction> deltaTransaction = ControllerUtils.convertDelta<TransactionDTO, Transaction>(deltaTransactionDTO);
            return deltaTransaction;
        }
    }
}
