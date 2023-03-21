// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

   binanceApiUrl: 'https://api.binance.com',
   queryCoins: '/api/v1/ticker/24hr',

   urlCoins: 'odata/Coins',
   urlWatchlists: 'odata/Watchlists',
   urlComments: 'odata/Comments',
   urlVotingHistories: 'odata/VotingHistories',

   urlTransactions: "odata/Transactions",
   urlFinanceTransactions: "odata/FinanceTransactions",
   urlFinanceTransactionSells: "odata/FinanceTransactionSells",
   urlFinanceTransactionBuys: "odata/FinanceTransactionBuys",
   urlTransferTransactions: "odata/TransferTransactions",
   urlTransferTransactionIns: "odata/TransferTransactionIns",
   urlTransferTransactionOuts: "odata/TransferTransactionOuts",
   urlApplicationUser: "odata/ApplicationUsers",
   urlNotifiers: "odata/Notifiers"
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
