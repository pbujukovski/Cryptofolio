using Hangfire;

namespace Cryptofolio.Services
{
    public static class RecurringJobService
    {

        public static void StartRecurringBackgroundJobs()
        {
            StartCryptoNotifierService();
        }

        [AutomaticRetry(Attempts = 2, OnAttemptsExceeded = AttemptsExceededAction.Fail)]
        private static void StartCryptoNotifierService()
        {
            RecurringJob.AddOrUpdate<ICryptoNotifierService>(
                schedulerService => schedulerService.SendCryptoNotificationsAsync(),
                Cron.MinuteInterval(30));
        }

    }
}
