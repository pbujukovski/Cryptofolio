using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cryptofolio.Models
{
    public class Notifier
    {
        [Key]
        public int Id { get; set; }

        public double DesiredPrice { get; set; }

        public DateTime DueDate { get; set; }

        public bool isHigher { get; set; }
        public string? ApplicationUserId { get; set; }

        [ForeignKey("ApplicationUserId")]
        public ApplicationUser? ApplicationUser { get; set; }

        public string CoinSymbol { get; set; } = string.Empty;

        [ForeignKey("CoinSymbol")]
        public Coin? Coin { get; set; }
    }
}
