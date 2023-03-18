import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CoinBinance, coinBinanceV2 } from '../models/coin-models/coin-binance';
import { cryptoSymbol } from 'crypto-symbol';

const { nameLookup } = cryptoSymbol({});

@Injectable({
  providedIn: 'root',
})
export class BinanceApiService {
  public environment = environment;

  private coins: CoinBinance[] = [];

  private httpClient!: HttpClient;
  private topCoins: CoinBinance[] = [];

  public coinv2: coinBinanceV2 = new coinBinanceV2();

  public CoinUpdated: BehaviorSubject<CoinBinance> =
    new BehaviorSubject<CoinBinance>(new CoinBinance());

  public TopCoinsUpdated: BehaviorSubject<CoinBinance[]> = new BehaviorSubject<
    CoinBinance[]
  >([]);

  public CoinsUpdated: BehaviorSubject<CoinBinance[]> = new BehaviorSubject<
    CoinBinance[]
  >([]);

  //Data as Json Array that comes from binance api
  public dataJson: Array<any> = new Array();

  //Regex expression to filter only USDT symbols
  public regex: RegExp = new RegExp('.*USDT');

  public regex1: RegExp = new RegExp('.*BUSD');
  //New coin model from binance
  public coin: CoinBinance = new CoinBinance();

  //Comunication Error subject
  public communicationError: Subject<boolean> = new Subject<boolean>();

  public coinSymbol: BehaviorSubject<string> = new BehaviorSubject<string>('');

  //Format coin price to Dollar
  public dollarCurr: Intl.NumberFormat = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  });

  constructor(private http: HttpClient) {
    this.httpClient = http;
  }

  //Request for binance api to get coins
  public getCoins(): Observable<any> {
    return this.http
      .get(this.environment.binanceApiUrl + this.environment.queryCoins)
      .pipe(
        tap((data) => {
          //get date as json object

          var dataAsJson = data;

          this.dataJson = [];

          this.dataJson.push(dataAsJson);

          this.coins = [];

          this.dataJson[0].forEach((coin: CoinBinance) => {
            this.coin = coin;

            //Step 2: Check if coin symbol matches regex pattern
            if (this.regex.test(coin.symbol) === true) {
              //Step 2.1: Split name to remove symbol pair such as USDT
              const splitName =
                coin.symbol.split('USDT').find((x) => x !== 'USDT') ?? '';

              //Step 2.2.1: Set splited name to current coin symbol etc.BTC from BTCUSDT
              this.coin.symbol = splitName;

              //Step 2.2: Find matching path for coin LOGO image
              this.coin.iconPath =
                './assets/icon/' + `${splitName.toLowerCase()}` + '.png';

              //Step 2.3: Find matching name for current symbol
              this.coin.name = nameLookup(splitName) ?? splitName;

              var coinPrice = parseFloat(this.coin.bidPrice);
              //Step 2.4: Format price with dollar currency
              this.coin.bidPrice = this.dollarCurr.format(
                parseFloat(this.coin.bidPrice)
              );

              this.coin.marketCap =
                Number(coin.lastPrice) * Number(coin.quoteVolume);

              // this.coin.quoteVolume = this.dollarCurr.format(
              //   parseFloat(this.coin.quoteVolume)
              // );

              this.coin.volume = this.dollarCurr.format(
                parseFloat(this.coin.volume)
              );
              //Step 2.5: Add percentage symbol to coin percent value
              this.coin.priceChangePercent =
                parseFloat(this.coin.priceChangePercent).toFixed(2) + '%';

              if (coin.symbol.length > 0 && coinPrice > 0) {
                //Step 3: Push coin to list
                this.coins.push(this.coin);
              }
            }
          });

          //Step 3.1: When all coins are in the list update BehaviorSubject
          this.CoinsUpdated.next(this.coins);
        })
      );
  }

  //Request for binance api to get top coins
  public getTopCoins(): Observable<any> {
    return this.http
      .get(this.environment.binanceApiUrl + this.environment.queryCoins)
      .pipe(
        tap((data) => {
          //get date as json object

          var dataAsJson = data;

          this.dataJson = [];

          this.dataJson.push(dataAsJson);

          this.coins = [];

          this.dataJson[0].forEach((coin: CoinBinance) => {
            this.coin = coin;

            //Step 2: Check if coin symbol matches regex pattern
            if (this.regex.test(coin.symbol) === true) {
              //Step 2.1: Split name to remove symbol pair such as USDT
              const splitName =
                coin.symbol.split('USDT').find((x) => x !== 'USDT') ?? '';

              //Step 2.2.1: Set splited name to current coin symbol etc.BTC from BTCUSDT
              this.coin.symbol = splitName;


              //Step 2.2: Find matching path for coin LOGO image
              this.coin.iconPath =
                './assets/icon/' + `${splitName.toLowerCase()}` + '.png';

                // if (!fs.existsSync(this.coin.iconPath)){
                //   this.coin.iconPath = '../../assets/default.png';
                // }



              //Step 2.3: Find matching name for current symbol
              this.coin.name = nameLookup(splitName) ?? splitName;

              //Step 2.4: Format price with dollar currency
              this.coin.bidPrice = this.dollarCurr.format(
                parseFloat(this.coin.bidPrice)
              );

              this.coin.lowPrice = this.dollarCurr.format(
                parseFloat(this.coin.lowPrice)
              );

              this.coin.highPrice = this.dollarCurr.format(
                parseFloat(this.coin.highPrice)
              );

              this.coin.marketCap =
                Number(coin.lastPrice) * Number(coin.quoteVolume);

              // this.coin.quoteVolume = this.dollarCurr.format(
              //   parseFloat(this.coin.quoteVolume)
              // );

              this.coin.volume = this.dollarCurr.format(
                parseFloat(this.coin.volume)
              );
              //Step 2.5: Add percentage symbol to coin percent value
              this.coin.priceChangePercent =
                parseFloat(this.coin.priceChangePercent).toFixed(2) + '%';

              if (coin.symbol.length > 0) {
                //Step 3: Push coin to list
                this.coins.push(this.coin);
              }
            }
          });
          // Step 4: Sort coins by market cap in descending order
          this.coins.sort((a, b) => b.marketCap - a.marketCap);
          // Step 5: Get the top N coins by market cap
          this.topCoins = this.coins.slice(0, 10);
          // Step 6: When all coins are in the list update BehaviorSubject
          this.TopCoinsUpdated.next(this.topCoins);
        })
      );
  }

  //Request for binance api to get coin for details
  public getCoin(coinSymbol: string): Observable<any> {
    return this.http
      .get(
        this.environment.binanceApiUrl +
          this.environment.queryCoins +
          '?symbol=' +
          coinSymbol +
          'USDT'
      )
      .pipe(
        tap((data) => {
          //get data as CoinBinance object
          let coin = data as CoinBinance;
          this.coin = coin;
          //Step 2: Check if coin symbol matches regex pattern
          if (this.regex.test(coin.symbol) === true) {
            //Step 2.1: Split name to remove symbol pair such as USDT
            const splitName =
              coin.symbol.split('USDT').find((x) => x !== 'USDT') ?? '';

            //Step 2.2.1: Set splited name to current coin symbol etc.BTC from BTCUSDT
            this.coin.symbol = splitName;

            //Step 2.2: Find matching path for coin LOGO image
            this.coin.iconPath =
              './assets/icon/' + `${splitName.toLowerCase()}` + '.png';

            //Step 2.3: Find matching name for current symbol
            this.coin.name = nameLookup(splitName) ?? splitName;

            //Step 2.4: Format price with dollar currency
            this.coin.bidPrice = this.dollarCurr.format(
              parseFloat(this.coin.bidPrice)
            );

            this.coin.marketCap =
              Number(coin.lastPrice) * Number(coin.quoteVolume);

            // this.coin.marketCap = this.dollarCurr.format(parseFloat(this.coin.marketCap));
            // this.coin.quoteVolume = this.dollarCurr.format(
            //   parseFloat(this.coin.quoteVolume)
            // );
            this.coin.volume = this.dollarCurr.format(
              parseFloat(this.coin.volume)
            );
            //Step 2.5: Add percentage symbol to coin percent value
            this.coin.priceChangePercent =
              parseFloat(this.coin.priceChangePercent).toFixed(2) + '%';

            //Step 3: Send only this coin becouse we are expecting only one element with matching symbol in Details Component
            this.CoinUpdated.next(this.coin);

          }
        })
      );
  }



  // getFolder(subFolder: string): Observable<string> {
  //   if (!subFolder) {
  //     return of('./assets/default.png');
  //   }

  //   const folderPath = `assets/icon/${subFolder}`;
  //   console.log(subFolder)

  //   console.log(this.httpClient.get)
  //   return this.httpClient
  //     .get(`${subFolder}`!, { observe: 'response', responseType: 'blob' })
  //     .pipe(
  //       map(response => {
  //         return subFolder;
  //       }),
  //       catchError(error => {
  //         return of('./assets/default.png');
  //       })
  //     );
  // }
}
