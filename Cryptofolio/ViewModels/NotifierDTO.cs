using Cryptofolio.Controllers;
using Cryptofolio.Models;
using Microsoft.AspNetCore.OData.Deltas;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using static System.Net.Mime.MediaTypeNames;

namespace Cryptofolio.ViewModels
{
    public class NotifierDTO
    {
        [Key]
        [JsonPropertyName("Id")]
        [JsonProperty("Id")]
        public int Id { get; set; }
        [JsonPropertyName("DesiredPrice")]
        [JsonProperty("DesiredPrice")]
        public double DesiredPrice { get; set; }
        [JsonPropertyName("DueDate")]
        [JsonProperty("DueDate")]
        public DateTime DueDate { get; set; }
        [JsonPropertyName("ApplicationUserId")]
        [JsonProperty("ApplicationUserId")]
        public string? ApplicationUserId { get; set; }

        [ForeignKey("ApplicationUserId")]
        [JsonProperty("ApplicationUser")]
        [Newtonsoft.Json.JsonIgnore]
        public ApplicationUserDTO? ApplicationUser { get; set; }
        [JsonPropertyName("CoinSymbol")]
        [JsonProperty("CoinSymbol")]
        public string CoinSymbol { get; set; } = string.Empty;

        [ForeignKey("CoinSymbol")]
        [JsonPropertyName("Coin")]
        [JsonProperty("Coin")]
        public Coin? Coin { get; set; }

        public NotifierDTO() { }

        public NotifierDTO(NotifierDTO notifierDTO)
        {
            Id = notifierDTO.Id;
            DesiredPrice = notifierDTO.DesiredPrice;
            DueDate = notifierDTO.DueDate;
            ApplicationUserId = notifierDTO.ApplicationUserId;
            CoinSymbol = notifierDTO.CoinSymbol;
        }

        public NotifierDTO(Notifier notifier)
        {
            Id = notifier.Id;
            DesiredPrice = notifier.DesiredPrice;
            DueDate = notifier.DueDate;
            if (notifier.ApplicationUserId != null)
            {
                ApplicationUserId = notifier.ApplicationUserId;

            }
            CoinSymbol = notifier.CoinSymbol;
        }

        public Notifier convertToNotifier()
        {
            Notifier notifier = new Notifier();

            notifier.Id = this.Id;
            notifier.DesiredPrice = this.DesiredPrice;
            notifier.DueDate = this.DueDate;
            if (ApplicationUserId != null)
            {
                notifier.ApplicationUserId = ApplicationUserId;
            }
            notifier.CoinSymbol = this.CoinSymbol;

            return notifier;
        }

        public static Delta<Notifier> toDeltaNotifier(Delta<NotifierDTO> deltaNotifierDTO)
        {
            Delta<Notifier> deltaNotifier = ControllerUtils.convertDelta<NotifierDTO, Notifier>(deltaNotifierDTO);
            return deltaNotifier;
        }
    }
}
