﻿using Cryptofolio.Controllers;
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


        [JsonPropertyName("Price")]
        public float Price { get; set; }

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

        [JsonPropertyName("FinanceTransactions")]
        public ICollection<FinanceTransaction> FinanceTransactions { get; set; }


        public TransactionDTO() { }

        public TransactionDTO(TransactionDTO transactionDTO)
        {
            Id = transactionDTO.Id;
            Date = transactionDTO.Date;
            Note = transactionDTO.Note;
            Price = transactionDTO.Price;
            Amount = transactionDTO.Amount;
            Fee = transactionDTO.Fee;
            ApplicationUserId = transactionDTO.ApplicationUserId;
            CoinSymbol = transactionDTO.CoinSymbol;
            FinanceTransactions = transactionDTO.FinanceTransactions;
        }

        public TransactionDTO(Transaction transaction)
        {
            Id = transaction.Id;
            Date = transaction.Date;
            Note = transaction.Note;
            Amount = transaction.Amount;
            Price = 0;
            Fee = transaction.Fee;
            ApplicationUserId = transaction.ApplicationUserId;
            CoinSymbol = transaction.CoinSymbol;
            FinanceTransactions = transaction.FinanceTransactions;
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
