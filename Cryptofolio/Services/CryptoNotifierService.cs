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

                /*              var test = coinResult.Data.Where(x => x.Symbol is currentCoinPrice).FirstOrDefault().ToList();*/

                /*	var currentCoinPrice1 = coinDictionary.LastPrice;*/

                coinBinances.Add(currentCoinPrice as CoinBinance);
                if(notifier.CoinSymbol == currentCoinPrice.Symbol) 
				if (currentCoinPrice is not null)
                {
                    emails.Add(_emailService.SendEmailAsync(new CryptoNotificationEmail(notifier.ApplicationUser?.Email ?? "", "Trkalo", notifier.CoinSymbol)));
                }
            }
            
            await Task.WhenAll(emails);

        }
    }
}
