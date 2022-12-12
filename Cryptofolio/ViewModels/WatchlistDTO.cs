using Cryptofolio.Controllers;
using Cryptofolio.Models;
using Microsoft.AspNetCore.OData.Deltas;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Cryptofolio.ViewModels
{
    public class WatchlistDTO
    {
        [JsonPropertyName("Id")]
        [Key]
        public int Id { get; set; }

        [JsonPropertyName("ApplicationUserId")]
        public string? ApplicationUserId { get; set; }

        [JsonPropertyName("ApplicationUser")]
        [ForeignKey("ApplicationUserId")]
        public ApplicationUserDTO? ApplicationUser { get; set; }

        [JsonPropertyName("Coins")]
        public List<CoinDTO>? Coins { get; set; }

        public WatchlistDTO() { }

        public WatchlistDTO(WatchlistDTO watchlistDTO)
        {
            Id= watchlistDTO.Id;
            ApplicationUserId = watchlistDTO.ApplicationUserId;
            if (watchlistDTO.Coins != null)
            {
                Coins = watchlistDTO.Coins;
            }
        }


        public WatchlistDTO(Watchlist watchlist, string applicationUserId)
        {
            Id = watchlist.Id;
            ApplicationUserId = watchlist.ApplicationUserId;
            if (watchlist.Coins != null)
            {
                Coins = watchlist.Coins.Select(c => new CoinDTO(c, applicationUserId)).ToList();
            }
        }

        public Watchlist convertToWatchlist()
        {
            Watchlist watchlist = new Watchlist();

            watchlist.Id = Id;
            watchlist.ApplicationUserId = ApplicationUserId;
            if (Coins != null)
            {
                watchlist.Coins = Coins.Select(c => c.convertToCoin()).ToList();
            }
            return watchlist;
        }

        public static Delta<Watchlist> toDeltaWatchlist(Delta<WatchlistDTO> deltaWatchlistDTO)
        {
            Delta<Watchlist> deltaWatchlist = ControllerUtils.convertDelta<WatchlistDTO, Watchlist>(deltaWatchlistDTO);
            return deltaWatchlist;
        }
    }
}
