using Microsoft.OData.ModelBuilder;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cryptofolio.Models
{
    public class FinanceTransaction : Transaction
    {
        public float Price { get; set; }

    }
}
