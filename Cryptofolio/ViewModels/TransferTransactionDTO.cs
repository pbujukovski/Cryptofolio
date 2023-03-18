using Cryptofolio.Controllers;
using Cryptofolio.Models;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.OData.ModelBuilder;

namespace Cryptofolio.ViewModels
{
    public class TransferTransactionDTO : TransactionDTO
    {
        public TransferTransactionDTO() : base() { }

        public TransferTransactionDTO(TransferTransactionDTO transferTransactionDTO) : base(transferTransactionDTO) { }

        public TransferTransactionDTO(TransferTransaction transferTransaction) : base(transferTransaction) { }

        public void convertToTransferTransaction<TransferTransactionType>(ref TransferTransactionType transferTransaction)
              where TransferTransactionType : TransferTransaction
        {
            // Convert base class
            base.convertToTransaction(ref transferTransaction);

        }

        public static Delta<TransferTransaction> toDeltaTransferTransaction(Delta<TransferTransactionDTO> deltaTransferTransactionDTO)
        {
            Delta<TransferTransaction> deltaTransferTransaction = ControllerUtils.convertDelta<TransferTransactionDTO, TransferTransaction>(deltaTransferTransactionDTO);
            return deltaTransferTransaction;
        }
    }
}
