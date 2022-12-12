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
    }
}