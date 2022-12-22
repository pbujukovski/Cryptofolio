using Cryptofolio.Controllers;
using Cryptofolio.Models;
using Microsoft.AspNetCore.OData.Deltas;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Cryptofolio.ViewModels
{
    public class VotingHistoryDTO
    {
        [Key]
        [JsonPropertyName("Id")]
        public int Id { get; set; }
        
        [JsonPropertyName("Status")]
        public VoteStatus Status { get; set; } = VoteStatus.Unknown;
        
        [JsonPropertyName("Date")]
        public DateTime Date { get; set; }
        
        [JsonPropertyName("CoinSymbol")]
        public string CoinSymbol { get; set; } = string.Empty;
        
        [ForeignKey("CoinSymbol")]
        [JsonIgnore]
        public CoinDTO? Coin { get; set; }

        [JsonPropertyName("ApplicationUserId")]
        public string? ApplicationUserId { get; set; }

        [JsonIgnore]
        [ForeignKey("ApplicationUserId")]
        public ApplicationUserDTO? ApplicationUser { get; set; }

        public VotingHistoryDTO() {}

        public VotingHistoryDTO(VotingHistoryDTO votingHistoryDTO)
        {
            Id = votingHistoryDTO.Id;
            Status = votingHistoryDTO.Status;
            Date = votingHistoryDTO.Date;
            CoinSymbol= votingHistoryDTO.CoinSymbol;
            ApplicationUserId = votingHistoryDTO.ApplicationUserId;
        }

        public VotingHistoryDTO(VotingHistory votingHistory)
        {
            Id = votingHistory.Id;
            Status = votingHistory.Status;
            Date = votingHistory.Date;
            CoinSymbol = votingHistory.CoinSymbol;

            ApplicationUserId = votingHistory.ApplicationUserId;
        }

        public VotingHistory convertToVotingHistory()
        {
            VotingHistory votingHistory = new VotingHistory();

            votingHistory.Id = this.Id;
            votingHistory.Status = this.Status;
            votingHistory.Date = this.Date;
            votingHistory.CoinSymbol = this.CoinSymbol;
            votingHistory.ApplicationUserId = ApplicationUserId;


            return votingHistory;
        }

        public static Delta<VotingHistory> toDeltaVotingHistory(Delta<VotingHistoryDTO> deltaVotingHistoryDTO)
        {
            Delta<VotingHistory> deltaVotingHistory = ControllerUtils.convertDelta<VotingHistoryDTO, VotingHistory>(deltaVotingHistoryDTO);
            return deltaVotingHistory;
        }

    }
}
