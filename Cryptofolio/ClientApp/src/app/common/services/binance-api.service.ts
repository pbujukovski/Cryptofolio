import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  Observable,
  pipe,
  repeat,
  Subject,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { CoinBinance, coinBinanceV2 } from '../models/coin-binance';
import { cryptoSymbol } from 'crypto-symbol';
import { Watchlist } from '../models/watchlist';

const { nameLookup } = cryptoSymbol({});

@Injectable({
  providedIn: 'root',
})
export class BinanceApiService {
  public environment = environment;

  private coins: CoinBinance[] = [];

  private coinsv2 : coinBinanceV2[] = [];

  public coinv2 : coinBinanceV2 = new coinBinanceV2;

  public CoinsUpdatedv2: BehaviorSubject<coinBinanceV2[]> = new BehaviorSubject<
  coinBinanceV2[]
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
    currency: 'USD'});

  constructor(private http: HttpClient) {}


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

              //Step 2.4: Format price with dollar currency
              this.coin.bidPrice = this.dollarCurr.format(parseFloat(this.coin.bidPrice));


              this.coin.volume = this.dollarCurr.format(parseFloat(this.coin.volume));
              //Step 2.5: Add percentage symbol to coin percent value
              this.coin.priceChangePercent =
                parseFloat(this.coin.priceChangePercent).toFixed(2) + '%';

              //Step 3: Push coin to list
              this.coins.push(this.coin);
            }
          });

          //Step 3.1: When all coins are in the list update BehaviorSubject
          this.CoinsUpdated.next(this.coins);

        })
      );
  }


  public url = "https://www.binance.com/exchange-api/v2/public/asset-service/product/get-products";


  public getCoinsv2(): Observable<any> {
    return this.http
      .get(this.url)
      .pipe(
        tap((data: any) => {
          //get date as json object
          var dataAsJson = data;
          console.log("HEREEEE");
          this.coinsv2 = [];
          this.dataJson = [];
          console.log(dataAsJson.data[0].s);
          // console.log(this.regex.test(dataAsJson[0].s))
          this.dataJson.push(dataAsJson.data);

          console.log(this.dataJson[0]);
          this.coins = [];

          this.dataJson[0].forEach((coin: coinBinanceV2) => {
            this.coinv2 = coin;
            console.log("HEREEEE");
            console.log(this.coinv2.s);
            console.log(this.regex.test(this.coinv2.s));
            //Step 2: Check if coin symbol matches regex pattern
            if (this.regex.test(this.coinv2.s) === true) {
              console.log("HERE IF REGEX PASSED");


              //Step 2.2: Find matching path for coin LOGO image
              this.coinv2.iconPath =
                './assets/icon/' + `${this.coinv2.b.toLowerCase()}` + '.png';


                this.coinv2.marketCap = +this.coinv2.o * this.coinv2.cs;
              //Step 3: Push coin to list
              this.coinsv2.push(this.coinv2);
              console.log(this.coinsv2);
            }
          });

          //Step 3.1: When all coins are in the list update BehaviorSubject
          this.CoinsUpdatedv2.next(this.coinsv2);

        })
      );



  }

  // public comineData() : any{
  //   combineLatest(this.CoinsUpdated,this.CoinsUpdatedv2).subscribe(
  //     ([coinsOne, coinsTwo]) => {
  //       /*
  //         Example:
  //       timerThree first tick: 'Timer One Latest: 0, Timer Two Latest: 0, Timer Three Latest: 0
  //       timerOne second tick: 'Timer One Latest: 1, Timer Two Latest: 0, Timer Three Latest: 0
  //       timerTwo second tick: 'Timer One Latest: 1, Timer Two Latest: 1, Timer Three Latest: 0
  //     */

  //       var jsonData =
  //       console.log(
  //         `Timer One Latest: ${coinsOne},
  //        Timer Two Latest: ${coinsTwo},
  //        `
  //       );
  // });
  // }
}
