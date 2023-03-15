import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { CoinKlineStream } from '../models/coin-models/coin-kline-stream';

@Injectable({
  providedIn: 'root',
})
export class BinanceKlineService {
  private klineUrl: string = 'https://api.binance.com/api/v3/klines?symbol=';
  private klineQuery: string = '&interval=';

  private coinSymbol: BehaviorSubject<string> = new BehaviorSubject<string>(
    'BTC'
  );
  public interval: BehaviorSubject<string> = new BehaviorSubject<string>('1m');

  private coins: CoinKlineStream[] = [];

  public coin: CoinKlineStream = new CoinKlineStream();

  public CoinUpdated: BehaviorSubject<CoinKlineStream> =
    new BehaviorSubject<CoinKlineStream>(new CoinKlineStream());

  public CoinsUpdated: BehaviorSubject<CoinKlineStream[]> = new BehaviorSubject<
    CoinKlineStream[]
  >([]);
  //Data as Json Array that comes from binance api
  public dataJson: Array<any> = new Array();

  constructor(private http: HttpClient) {
  }

  getData(): Observable<any> {
    return this.http
      .get(
        this.klineUrl +
          this.coinSymbol.value +
          'USDT' +
          this.klineQuery +
          this.interval.value
      )
      .pipe(
        map((data: any) => {
          return data.map((point: CoinKlineStream) => {
            this.coins.push(point);
          });
        })
      );
  }

  getStockData(interval: string, symbol: string) {
    return this.http.get(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}`
    );
  }

  public articles: any[] = [];
  public CoinUpdatedPrice: BehaviorSubject<Object> =
  new BehaviorSubject<Object>(new Object());

  getPriceData(interval: string, symbol: string, startTime: number, endTime: number) {
   const url =
      `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}&startTime=${startTime}&endTime=${endTime}`;

      this.http.get(url).subscribe((data: any) => {
      this.articles = data;
      this.CoinUpdatedPrice.next(data);
    });
  }
}
