using Cryptofolio.Models;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace Cryptofolio.ViewModels
{
    public class VoteStatisticsDTO
    {

        [JsonPropertyName("BullishCount")]
        [JsonProperty("BullishCount")]
        public int BullishCount { get; set; }

        [JsonPropertyName("BearishCount")]
        [JsonProperty("BearishCount")]
        public int BearishCount { get; set; }

        [JsonPropertyName("CurrentUserVoted")]
        [JsonProperty("CurrentUserVoted")]
        public bool CurrentUserVoted { get; set; } = false;

        [JsonPropertyName("Date")]
        [JsonProperty("Date")]
        public DateTime Date { get; set; }

/*        [JsonPropertyName("Status")]
        [JsonProperty("Status")]
        public VoteStatus Status { get; set; } = VoteStatus.Unknown;*/

        public VoteStatisticsDTO() { }



    }
}
