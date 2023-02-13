using Cryptofolio.Controllers;
using Cryptofolio.Models;
using Microsoft.AspNetCore.OData.Deltas;

namespace Cryptofolio.ViewModels
{
    public class FinanceTransactionSellDTO : FinanceTransactionDTO
    {

        public FinanceTransactionSellDTO() { }

        public FinanceTransactionSellDTO(FinanceTransactionSellDTO financeTransactionSellDTO) : base(financeTransactionSellDTO)
        {
        }

        public FinanceTransactionSellDTO(FinanceTransactionSell financeTransactionSell) : base(financeTransactionSell) { }

        public FinanceTransactionSell convertToFinanceTransactionSell()
        {
            FinanceTransactionSell financeTransactionSell = new FinanceTransactionSell();
            // Convert base class

            base.convertToFinanceTransaction(ref financeTransactionSell);

            return financeTransactionSell;
        }

        public static Delta<FinanceTransactionSell> toDeltaFinanceTransactionSell(Delta<FinanceTransactionSellDTO> deltaFinanceTransactionSellDTO)
        {
            Delta<FinanceTransactionSell> deltaFinanceTransactionSell = ControllerUtils.convertDelta<FinanceTransactionSellDTO, FinanceTransactionSell>(deltaFinanceTransactionSellDTO);
            return deltaFinanceTransactionSell;
        }
    }
}
