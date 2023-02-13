using Cryptofolio.Controllers;
using Cryptofolio.Models;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.Identity.Client;
using Microsoft.OData.ModelBuilder;

namespace Cryptofolio.ViewModels
{
    public class TransferTransactionOutDTO : TransferTransactionDTO
    {
        public TransferTransactionOutDTO() { }

        public TransferTransactionOutDTO(TransferTransactionOutDTO transferTransactionOutDTO) : base(transferTransactionOutDTO) { }

        public TransferTransactionOutDTO(TransferTransactionOut transferTransactionOut) : base(transferTransactionOut) { }

        public TransferTransactionOut convertToTransferTransactionOut()
        {
            TransferTransactionOut transferTransactionOut = new TransferTransactionOut();
            base.convertToTransferTransaction(ref transferTransactionOut);

            return transferTransactionOut;
        }

        public static Delta<TransferTransactionOut> toDeltaTransferTransactionOut(Delta<TransferTransactionOutDTO> deltaTransferTransactionOutDTO)
        {
            Delta<TransferTransactionOut> deltaTransferTransactionOut = ControllerUtils.convertDelta<TransferTransactionOutDTO, TransferTransactionOut>(deltaTransferTransactionOutDTO);
            return deltaTransferTransactionOut;
        }
    }
}
