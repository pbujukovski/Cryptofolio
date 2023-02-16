import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { concatMap, Subscription, timer } from 'rxjs';
import { CoinBinance } from '../common/models/coin-binance';
import { BinanceApiService } from '../common/services/binance-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private apiUrl = 'https://newsapi.org/v2/top-headlines';
  private apiKey = 'abf821aef3294839aa9cc34dcc08628f';
  public articles: any[] = [];
  private binanceApiSubscription: Subscription;
  public data: CoinBinance[] = [];

  constructor(private http: HttpClient, private binanceApiService: BinanceApiService) {
    const binanceApiObsearvable$ = timer(1000, 20000);

    //Subscribe to get coins updated from Binance Service
    this.binanceApiSubscription = this.binanceApiService.TopCoinsUpdated.subscribe(
      (data) => {
        //Set data to data from binance service
        this.data = data;

        console.log("DATA IN HOME");
        console.log(this.data);

      }
    );

    this.binanceApiSubscription = binanceApiObsearvable$
    .pipe(concatMap(() => this.binanceApiService.getTopCoins()))
    .subscribe();
   }

  ngOnInit(){
    this.getNews();
  }

  ngOnDestroy(){
    this.binanceApiSubscription.unsubscribe();
  }
  getNews() {
    const url = `https://newsapi.org/v2/top-headlines?q=crypto&category=business&language=en&apiKey=abf821aef3294839aa9cc34dcc08628f`;
     this.http.get(url).subscribe((data:  any) => {
      console.log(data);
      this.articles = data.articles;
      console.log(this.articles);
    })
  }


  onScrollDown() {
    console.log("scrolled down!!");
  }

  onScrollUp() {
    console.log("scrolled up!!");
  }
}
