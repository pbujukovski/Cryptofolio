using Binance.Net.Clients;
using Cryptofolio.Data;
using Cryptofolio.Email.Models;
using Cryptofolio.Email.Services;
using Cryptofolio.Models;
using Cryptofolio.ViewModels;
using FluentEmail.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Cryptofolio.Services
{
    public class CryptoNotifierService : ICryptoNotifierService
    {
        private readonly IEmailService _emailService;

        private readonly BinanceClient _binanceClient;

        private readonly ApplicationDbContext _applicationDbContext;

        public CryptoNotifierService(IEmailService emailService, BinanceClient binanceClient, ApplicationDbContext applcationDbContext) {
            _emailService = emailService;
            _binanceClient= binanceClient;
            _applicationDbContext= applcationDbContext;
        }

        public async Task SendCryptoNotificationsAsync()
        {

            List<Notifier> notifiers = await _applicationDbContext.Notifiers?.Where(n => n.DueDate >= DateTime.UtcNow).Include(n => n.ApplicationUser).ToListAsync();

            List<CoinBinance> coinBinances = new List<CoinBinance>();

            if (!notifiers.Any())
            {
                return;
            }

            var symbols = notifiers.Select(n => $@"{n.CoinSymbol}USDT").ToList();

            var coinResult = await _binanceClient.SpotApi.ExchangeData.GetTickersAsync(symbols);

            if (!coinResult.Success)
            {
                return;
            }

          

            var coinDictionary = coinResult.Data.ToDictionary(x => x.Symbol);


            List<Task<SendResponse>> emails = new List<Task<SendResponse>>();

            foreach(var notifier in notifiers)
            {
                var currentCoinPrice = coinDictionary[$@"{notifier.CoinSymbol}USDT"];

                var lastCoinPrice = Decimal.ToDouble(currentCoinPrice.LastPrice);
                var shouldSendEmail = currentCoinPrice is not null && ((
                    notifier.isHigher && notifier.DesiredPrice < lastCoinPrice) || (!notifier.isHigher && notifier.DesiredPrice > lastCoinPrice));

				if (shouldSendEmail)
                {
                    emails.Add(_emailService.SendEmailAsync(
                            new CryptoNotificationEmail(notifier.ApplicationUser?.Email ?? "", "Cryptofolio Notifier",
                            notifier.CoinSymbol,
							decimal.Round(currentCoinPrice.LastPrice, 2, MidpointRounding.AwayFromZero),
							decimal.Round(currentCoinPrice.WeightedAveragePrice, 2, MidpointRounding.AwayFromZero),
                            currentCoinPrice.PriceChangePercent,
                            notifier.isHigher)));
                }
            }
            
            await Task.WhenAll(emails);

        }
    }
}
