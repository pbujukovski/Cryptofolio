using Cryptofolio.Models;
using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Cryptofolio.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            ModelBuilderExtention.ConfigurationEntity(builder);
            var task = ModelBuilderExtention.SeedAsync(builder, this);
            task.Wait();
        }

        public DbSet<Cryptofolio.Models.Coin>? Coins { get; set; }
        public DbSet<Cryptofolio.Models.Watchlist>? Watchlists { get; set; }
        public DbSet<Cryptofolio.Models.Comment>? Comments { get; set; }
        public DbSet<Cryptofolio.Models.VotingHistory>? VotingHistories { get; set; }

        public DbSet<Cryptofolio.Models.Transaction>? Transactions { get; set; }

        public DbSet<Cryptofolio.Models.FinanceTransaction>? FinanceTransactions { get; set; }

        public DbSet<Cryptofolio.Models.FinanceTransactionBuy>? FinanceTransactionBuys { get; set; }

        public DbSet<Cryptofolio.Models.FinanceTransactionSell>? FinanceTransactionSells { get; set; }

        public DbSet<Cryptofolio.Models.TransferTransaction>? TransferTransactions { get; set; }

        public DbSet<Cryptofolio.Models.TransferTransactionIn>? TransferTransactionIns { get; set; }

        public DbSet<Cryptofolio.Models.TransferTransactionOut>? TransferTransactionOuts { get; set; }
    }
}