const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:38412';

const PROXY_CONFIG = [
  {
    context: [
      "/$odata",
      "/odata",
      "/weatherforecast",
      "/_configuration",
      "/.well-known",
      "/Identity",
      "/connect",
      "/ApplyDatabaseMigrations",
      "/_framework",
      "/odata/Coins",
      "/odata/Watchlists",
      "/api/Watchlists",
      "/odata/Comments",
      "/odata/VotingHistories",
      "/odata/Transactions",
      "/odata/FinanceTransactions",
      "/odata/FinanceTransactionSells",
      "/odata/FinanceTransactionBuys",
      "/odata/TransferTransactions",
      "/odata/TransferTransactionIns",
      "/odata/TransferTransactionOuts",
      "/odata/ApplicationUsers"

   ],
    target: target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  }
]

module.exports = PROXY_CONFIG;
