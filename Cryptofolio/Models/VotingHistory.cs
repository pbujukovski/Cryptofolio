using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cryptofolio.Models
{
    public class VotingHistory
    {
        [Key]
        public int Id { get; set; }

        public VoteStatus Status { get; set; } = VoteStatus.Unknown;

        public DateTime Date { get; set; }
        public string CoinSymbol { get; set; } = string.Empty;

        [ForeignKey("CoinSymbol")]
        public Coin? Coin { get; set; }

        public string? ApplicationUserId { get; set; }

        [ForeignKey("ApplicationUserId")]
        public ApplicationUser? ApplicationUser { get; set; }
    }

    public enum VoteStatus
    {
        Unknown,
        Bullish,
        Bearish
    }
}
