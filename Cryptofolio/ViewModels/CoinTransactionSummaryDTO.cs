namespace Cryptofolio.ViewModels
{
    public class CoinTransactionSummaryDTO
    {
        public CoinTransactionSummaryDTO()
        {
        }

        public CoinTransactionSummaryDTO(string coinSymbol, float profitLoss)
        {
            CoinSymbol = coinSymbol;
            ProfitLoss = profitLoss;
        }

        public string CoinSymbol { get; init;}

        public float ProfitLoss { get; init; }

    }
}
