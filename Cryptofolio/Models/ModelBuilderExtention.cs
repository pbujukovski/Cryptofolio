using Cryptofolio.Data;
using Duende.IdentityServer.Events;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using static CryptoExchange.Net.Sockets.SocketConnection;
using System.Net.Sockets;
using CryptoExchange.Net.CommonObjects;

namespace Cryptofolio.Models
{
    public static class ModelBuilderExtention
    {
            public static void ConfigurationEntity(this ModelBuilder builder)
            {
                builder.Entity<Coin>().ToTable("Coin");
                builder.Entity<Watchlist>().ToTable("Watchlist");
                builder.Entity<Comment>().ToTable("Comment");
                builder.Entity<VotingHistory>().ToTable("VotingHistory");
                builder.Entity<Transaction>().ToTable("Transaction");
                builder.Entity<FinanceTransaction>().ToTable("FinanceTransaction");
                builder.Entity<FinanceTransactionBuy>().ToTable("FinanceTransactionBuy");
                builder.Entity<FinanceTransactionSell>().ToTable("FinanceTransactionSell");
                builder.Entity<TransferTransaction>().ToTable("TransferTransaction");
                builder.Entity<TransferTransactionIn>().ToTable("TransferTransactionIn");
                builder.Entity<TransferTransactionOut>().ToTable("TransferTransactionOut");
                builder.Entity<Notifier>().ToTable("Notifier");


          
            builder.Entity<Transaction>()
                .HasMany(o => o.FinanceTransactions)
                .WithOne(oi => oi.Transaction)
                .HasForeignKey(oi => oi.TransactionId).OnDelete(DeleteBehavior.Cascade);

            builder.Entity<FinanceTransaction>()
    .HasOne(o => o.Transaction)
    .WithMany(oi => oi.FinanceTransactions)
    .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<TransferTransaction>()
.HasOne(o => o.Transaction)
.WithMany(oi => oi.TransferTransactions)
.OnDelete(DeleteBehavior.NoAction);


        }
        public static Task SeedAsync(this ModelBuilder modelBuilder, ApplicationDbContext applicationDbContext)
            {
                PasswordHasher<IdentityUser> hasher = new PasswordHasher<IdentityUser>();

                //Seeding ApplicationUser
                ApplicationUser[] applicationUser = new ApplicationUser[3];

                //Seed data for ApplicationUser  1
                applicationUser[0] = new ApplicationUser();
                applicationUser[0].Id = Guid.NewGuid().ToString();
                applicationUser[0].FirstName = "Admin";
                applicationUser[0].LastName = "Admin";
                applicationUser[0].UserName = "admin@mail.com";
                applicationUser[0].NormalizedUserName = "admin@mail.com";
                applicationUser[0].Email = "admin@mail.com";
                applicationUser[0].NormalizedEmail = "admin@mail.com";
                applicationUser[0].EmailConfirmed = true;
                applicationUser[0].PasswordHash = hasher.HashPassword(null, "5");
                applicationUser[0].SecurityStamp = string.Empty;

                modelBuilder.Entity<ApplicationUser>().HasData(applicationUser[0]);

            //Seed data for ApplicationUser  1
            applicationUser[1] = new ApplicationUser();
            applicationUser[1].Id = Guid.NewGuid().ToString();
            applicationUser[1].FirstName = "Petar";
            applicationUser[1].LastName = "Bujukovski";
            applicationUser[1].UserName = "pbujukovski@gmail.com";
            applicationUser[1].NormalizedUserName = "pbujukovski@gmail.com";
            applicationUser[1].Email = "pbujukovski@gmail.com";
            applicationUser[1].NormalizedEmail = "pbujukovski@gmail.com";
            applicationUser[1].EmailConfirmed = true;
            applicationUser[1].PasswordHash = hasher.HashPassword(null, "Test_123?");
            applicationUser[1].SecurityStamp = string.Empty;

            modelBuilder.Entity<ApplicationUser>().HasData(applicationUser[1]);

            //Seed data for ApplicationUser  1
            applicationUser[2] = new ApplicationUser();
            applicationUser[2].Id = Guid.NewGuid().ToString();
            applicationUser[2].FirstName = "Jhon";
            applicationUser[2].LastName = "Smith";
            applicationUser[2].UserName = "jhon@mail.com";
            applicationUser[2].NormalizedUserName = "jhon@gmail.com";
            applicationUser[2].Email = "jhon@gmail.com";
            applicationUser[2].NormalizedEmail = "jhon@gmail.com";
            applicationUser[2].EmailConfirmed = true;
            applicationUser[2].PasswordHash = hasher.HashPassword(null, "Test_123?");
            applicationUser[2].SecurityStamp = string.Empty;

            modelBuilder.Entity<ApplicationUser>().HasData(applicationUser[2]);


            return Task.CompletedTask;
            }
        }
    }
