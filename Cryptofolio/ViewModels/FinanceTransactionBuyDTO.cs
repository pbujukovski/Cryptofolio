using Cryptofolio.Controllers;
using Cryptofolio.Models;
using Microsoft.AspNetCore.OData.Deltas;

namespace Cryptofolio.ViewModels
{
    public class FinanceTransactionBuyDTO : FinanceTransactionDTO
    {

        public FinanceTransactionBuyDTO() { }

        public FinanceTransactionBuyDTO(FinanceTransactionBuyDTO financeTransactionBuyDTO) : base(financeTransactionBuyDTO) 
        { 
        }

        public FinanceTransactionBuyDTO(FinanceTransactionBuy financeTransactionBuy) : base(financeTransactionBuy) { }

        public FinanceTransactionBuy convertToFinanceTransactionBuy()
        {
            FinanceTransactionBuy financeTransactionBuy = new FinanceTransactionBuy();
            // Convert base class

            base.convertToFinanceTransaction(ref financeTransactionBuy);
           
            return financeTransactionBuy;
        }

        public static Delta<FinanceTransactionBuy> toDeltaFinanceTransactionBuy(Delta<FinanceTransactionBuyDTO> deltaFinanceTransactionBuyDTO)
        {
            Delta<FinanceTransactionBuy> deltaFinanceTransactionBuy = ControllerUtils.convertDelta<FinanceTransactionBuyDTO, FinanceTransactionBuy>(deltaFinanceTransactionBuyDTO);
            return deltaFinanceTransactionBuy;
        }

    }
}
