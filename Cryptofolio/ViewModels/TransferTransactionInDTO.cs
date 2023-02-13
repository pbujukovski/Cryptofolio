using Cryptofolio.Controllers;
using Cryptofolio.Models;
using Microsoft.AspNetCore.OData.Deltas;

namespace Cryptofolio.ViewModels
{
    public class TransferTransactionInDTO : TransferTransactionDTO
    {

        public TransferTransactionInDTO() { }

        public TransferTransactionInDTO(TransferTransactionInDTO transferTransactionInDTO) : base(transferTransactionInDTO) {}

        public TransferTransactionInDTO(TransferTransactionIn transferTransactionIn) : base(transferTransactionIn) { }

        public TransferTransactionIn convertToTransferTransactionIn()
        {
            TransferTransactionIn transferTransactionIn = new TransferTransactionIn();

            base.convertToTransferTransaction(ref transferTransactionIn);

            return transferTransactionIn;

        }

        public static Delta<TransferTransactionIn> toDeltaTransferTransactionIn(Delta<TransferTransactionInDTO> deltaTransferTransactionInDTO)
        {
            Delta<TransferTransactionIn> deltaTransferTransactionIn = ControllerUtils.convertDelta<TransferTransactionInDTO, TransferTransactionIn>(deltaTransferTransactionInDTO);
            return deltaTransferTransactionIn;
        }
    }
}
