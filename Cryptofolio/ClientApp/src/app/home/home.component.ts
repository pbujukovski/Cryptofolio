import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { concatMap, Subscription, timer } from 'rxjs';
import { ApplicationPaths } from 'src/api-authorization/api-authorization.constants';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { CoinBinance } from '../common/models/coin-models/coin-binance';
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
  private subscriptionisAuthenticated: Subscription;
  public topCoinsBinance: CoinBinance[] = [];

  public dataArrivedEvent : boolean = false;

  constructor(private http: HttpClient, private router: Router, private binanceApiService: BinanceApiService, private authorizeService: AuthorizeService) {

    this.subscriptionisAuthenticated = this.authorizeService.isAuthenticated().pipe().subscribe(isAuthenticated => {

      // if (isAuthenticated == true){}
      this.manageUserAuthorization(isAuthenticated);

    }
    );

    const binanceApiObsearvable$ = timer(1000, 20000);

    //Subscribe to get coins updated from Binance Service
    this.binanceApiSubscription = this.binanceApiService.TopCoinsUpdated.subscribe(
      (data) => {
        //Set data to data from binance service
        this.topCoinsBinance = data;
        this.getNews();
      }
    );

    this.binanceApiSubscription = binanceApiObsearvable$
    .pipe(concatMap(() => this.binanceApiService.getTopCoins()))
    .subscribe();
   }

  ngOnInit(){
  }

  ngOnDestroy() {
    //Unsubscribe on destroy
    this.subscriptionisAuthenticated.unsubscribe();
    this.binanceApiSubscription.unsubscribe();
  }

  // Link for news api
  // `https://newsapi.org/v2/top-headlines?q=crypto&category=business&language=en&apiKey=abf821aef3294839aa9cc34dcc08628f`;

  //Get news data with params = /top-headlines?q=crypto&category=business&language=en
  getNews() {
    const url = `https://newsapi.org/v2/top-headlines?q=crypto&category=business&language=en&apiKey=abf821aef3294839aa9cc34dcc08628f`;
     this.http.get(url).subscribe((data:  any) => {
       this.articles = data.articles;
       console.log(this.articles);
       if(this.topCoinsBinance.length > 0){
         this.dataArrivedEvent = true;
       }
    });
  }

  manageUserAuthorization(isAuthenticated: boolean): void {
    console.log("manageUserAuthorization: Begin");
    if (!isAuthenticated) {
      // If it is not authenticated log in
      this.router.navigate(ApplicationPaths.LoginPathComponents);
    }
}
}
