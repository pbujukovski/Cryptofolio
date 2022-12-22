using System.Text.Json.Serialization;

namespace Cryptofolio.ViewModels
{
    public class AddCoinToWatchlistRequest
    {
        [JsonPropertyName("WatchlistId")]
        public int? WatchlistId { get; set; }
        [JsonPropertyName("CoinSymbol")]
        public string CoinSymbol { get; set; } = string.Empty;

        [JsonPropertyName("StarIndicator")]
        public bool StarIndicator { get; set; } = false; 
    }
}
