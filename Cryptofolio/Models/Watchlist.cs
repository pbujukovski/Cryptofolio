using System.ComponentModel.DataAnnotations.Schema;

namespace Cryptofolio.Models
{
    public class Watchlist
    {
        public Watchlist()
        {
            this.Coins = new List<Coin>();
        }

        public int Id { get; set; }

        public string? ApplicationUserId { get; set; }

        [ForeignKey("ApplicationUserId")]
        public ApplicationUser ApplicationUser { get; set; }

        public List<Coin> Coins { get; set; }

    }
}
