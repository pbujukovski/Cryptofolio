using CryptoExchange.Net.CommonObjects;
using Cryptofolio.Controllers;
using Cryptofolio.Models;
using Microsoft.AspNetCore.OData.Deltas;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Cryptofolio.ViewModels
{
    public class CommentDTO
    {
        [JsonPropertyName("Id")]
        [Key]
        public int Id { get; set; }

        [JsonPropertyName("Text")]
        public string Text { get; set; } = string.Empty;

        [JsonPropertyName("Date")]
        public DateTime Date { get; set; }

        [JsonPropertyName("ApplicationUserId")]
        public string? ApplicationUserId { get; set; }

        [ForeignKey("ApplicationUserId")]
        public ApplicationUserDTO? ApplicationUser { get; set; }

        [JsonPropertyName("CoinSymbol")]
        public string CoinSymbol { get; set; } = string.Empty;

        [ForeignKey("CoinID")]
        public CoinDTO? Coin { get; set; }

        [JsonPropertyName("IsEditable")]
        public bool IsEditable { get; set; } = false;

        [JsonPropertyName("Name")]
        public string Name { get; set; } = string.Empty;


        public CommentDTO() { }

        public CommentDTO(CommentDTO commentDTO)
        {
            Id = commentDTO.Id;
            Text = commentDTO.Text;
            Date = commentDTO.Date;
            ApplicationUserId = commentDTO.ApplicationUserId;
            IsEditable = commentDTO.IsEditable;
            Name = commentDTO.Name;
            CoinSymbol = commentDTO.CoinSymbol;
        }

        public CommentDTO(Comment comment, string applicationUserId)
        {
            Id = comment.Id;
            Text = comment.Text;
            Date = comment.Date;
            if (comment.ApplicationUserId != null)
            {
                ApplicationUserId = comment.ApplicationUserId;
                IsEditable = comment.ApplicationUserId == applicationUserId;
                Name = comment.ApplicationUser.FirstName + " " + comment.ApplicationUser.LastName;

            }
            CoinSymbol = comment.CoinSymbol;
        }

        public Comment convertToComment()
        {
            Comment comment = new Comment();

            comment.Id = this.Id;
            comment.Text = this.Text;
            if (ApplicationUserId != null)
            {
                comment.ApplicationUserId = ApplicationUserId;
            }
            comment.CoinSymbol = this.CoinSymbol;
            

            return comment;
        }

        public static Delta<Comment> toDeltaComment(Delta<CommentDTO> deltaCommentDTO)
        {
            Delta<Comment> deltaComment = ControllerUtils.convertDelta<CommentDTO, Comment>(deltaCommentDTO);
            return deltaComment;
        }
    }
}
