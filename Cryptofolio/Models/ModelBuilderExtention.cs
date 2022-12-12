using Cryptofolio.Data;
using Duende.IdentityServer.Events;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using static CryptoExchange.Net.Sockets.SocketConnection;
using System.Net.Sockets;

namespace Cryptofolio.Models
{
    public static class ModelBuilderExtention
    {
            public static void ConfigurationEntity(this ModelBuilder builder)
            {
                builder.Entity<Coin>().ToTable("Coin");
                builder.Entity<Watchlist>().ToTable("Watchlist");
                builder.Entity<Comment>().ToTable("Comment");
             }
            public static Task SeedAsync(this ModelBuilder modelBuilder, ApplicationDbContext applicationDbContext)
            {
                PasswordHasher<IdentityUser> hasher = new PasswordHasher<IdentityUser>();

                //Seeding ApplicationUser
                ApplicationUser[] applicationUser = new ApplicationUser[1];

                //Seed data for ResidetUser  1
                applicationUser[0] = new ApplicationUser();
                applicationUser[0].Id = Guid.NewGuid().ToString();
                applicationUser[0].FirstName = "Admin";
                applicationUser[0].LastName = "Admin";
                applicationUser[0].UserName = "admin@mail.com";
                applicationUser[0].NormalizedUserName = "admin@mail.com";
                applicationUser[0].Email = "admin@mail.com";
                applicationUser[0].NormalizedEmail = "admin@mail.com";
                applicationUser[0].EmailConfirmed = true;
                applicationUser[0].PasswordHash = hasher.HashPassword(null, "Test_123?");
                applicationUser[0].SecurityStamp = string.Empty;

                modelBuilder.Entity<ApplicationUser>().HasData(applicationUser[0]);



                return Task.CompletedTask;
            }
        }
    }
