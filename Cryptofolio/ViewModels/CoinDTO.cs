using Cryptofolio.Controllers;
using Cryptofolio.Models;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.Identity.Client;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;

namespace Cryptofolio.ViewModels
{
    public class CoinDTO
    {
        [JsonPropertyName("Symbol")]
        [Key]
        public string Symbol { get; set; } = string.Empty;

        [JsonPropertyName("Comments")]
        List<CommentDTO>? Comments { get; set; }

        [JsonPropertyName("Watchlists")]
        List<WatchlistDTO>? Watchlists { get; set; }

        public CoinDTO() {}

        public CoinDTO(CoinDTO coinDTO)
        {
            Symbol = coinDTO.Symbol;
            if (coinDTO.Comments != null)
            {
                Comments = coinDTO.Comments;
            }
            Watchlists = coinDTO.Watchlists;
        }

        public CoinDTO(Coin coin, string applicationUserId)
        {
            Symbol = coin.Symbol;

            if (coin.Comments != null)
            {
                Comments = coin.Comments.Select(c => new CommentDTO(c, applicationUserId)).ToList();
            }
            if (coin.Watchlists != null)
            {
                Watchlists = coin.Watchlists.Select(c => new WatchlistDTO(c, applicationUserId)).ToList();
            }


        }
        

        public Coin convertToCoin()
        {
            Coin coin = new Coin();

            coin.Symbol = Symbol;

            coin.Comments = Comments.Select(c => c.convertToComment()).ToList();

            coin.Watchlists = Watchlists.Select(w => w.convertToWatchlist()).ToList();

            return coin;
        }

        public static Delta<Coin> toDeltaCoin(Delta<CoinDTO> deltaCoinDTO)
        {
            Delta<Coin> deltaCoin = ControllerUtils.convertDelta<CoinDTO, Coin>(deltaCoinDTO);
            return deltaCoin;
        }
    }
}
