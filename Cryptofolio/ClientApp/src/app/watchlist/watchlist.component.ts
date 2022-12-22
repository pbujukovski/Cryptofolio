import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChipListComponent } from '@syncfusion/ej2-angular-buttons';
import { EditSettingsModel, GridComponent, PageSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor, Query, ReturnOption } from '@syncfusion/ej2-data';
import { concatMap, Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coin } from '../common/models/coin';
import { CoinBinance } from '../common/models/coin-binance';
import { AddCoinToWatchlistRequest, Watchlist } from '../common/models/watchlist';
import { BinanceApiService } from '../common/services/binance-api.service';
import { WatchlistService } from '../common/services/watchlist.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit, OnDestroy {
  // public data: DataManager;
  // public queryWatchlist : Query;
  public dataWatchlist!: Watchlist;
  public dataCoins: CoinBinance[] = [];

  public pageSettings!: PageSettingsModel;

  public watchlistSubscription!: Subscription;
  public binanceApiSubscription!: Subscription;

  public editSettings!: EditSettingsModel;
  public toolbar!: ToolbarItems[] | object;
  public dataGrid: CoinBinance[] = [];

  public isDataArrived : boolean = false;

  public addCoinToWatchlistRequest: AddCoinToWatchlistRequest =
  new AddCoinToWatchlistRequest();

  @ViewChild('grid') public grid!: GridComponent;
  constructor(public binanceApiService: BinanceApiService,public watchlistService: WatchlistService, public router: Router) {
    const binanceApiObsearvable$ = timer(500, 15000);
    this.watchlistService.getWatchList();

   this.watchlistSubscription = this.watchlistService.WatchlistUpdate.subscribe(watchlist => {
      console.log(watchlist);
     this.dataWatchlist = watchlist;
      console.log(this.dataWatchlist);
    });


    this.binanceApiSubscription =  binanceApiObsearvable$
    .pipe(concatMap(() => this.binanceApiService.getCoins()))
    .subscribe();

    this.binanceApiSubscription = this.binanceApiService.CoinsUpdated.subscribe(coins => {
      this.dataCoins = coins;
      console.log(this.dataCoins);

      this.dataGrid = this.dataCoins.filter((data)=> this.dataWatchlist.Coins.some(coinSymbol => coinSymbol.Symbol === data.symbol))

      if (this.dataCoins.length > 0){
      this.isDataArrived = true;
    }

      // this.dataGrid = [];
      // this.dataCoins.filter((data) => {
      //   this.dataWatchlist.Coins.forEach(coinSymol => {
      //     if (coinSymol.Symbol === data.symbol){
      //       this.dataGrid.push(data);
      //     }
      //   });
      // });
      console.log("DATA GRID");
      console.log(this.dataGrid);
    });

    // this.dataGrid = this.dataCoins.filter((data) =>    this.dataWatchlist.Coins.find(data.symbol == Symbol))

  }

  ngOnInit(): void {

    this.editSettings = {
      allowEditing: false,
      allowAdding: false,
      allowDeleting: true,
      mode: 'Dialog',
    };

    //Add search to toolbar
    this.toolbar = ['Search'];
  }



  public onDetailsClicked(args: any) {
    let test = this.grid.getRowInfo(args.target).rowData as CoinBinance;
    this.binanceApiService.coinSymbol.next(test.symbol);
    this.router.navigate(['crypto-details']);
  }

  public onRemoveCoinClicked(data: CoinBinance) {
    console.log('this.selectedSymbol');
    // let test = this.grid.getRowInfo(args.target).rowData as CoinBinance;
    console.log("test.symbol");
    // console.log(test.symbol);
    // console.log(args);
    // console.log(args.index);
    console.log(data);


    let dataGrid : any = this.dataGrid.find(coin => coin.symbol === data.symbol);

    this.dataGrid.splice(dataGrid, 1);

    this.grid.deleteRecord('symbol', data);
    this.grid.refresh();
    console.log(data);
    console.log(this.dataGrid);
    this.addCoinToWatchlistRequest.CoinSymbol = data.symbol;
    this.addCoinToWatchlistRequest.StarIndicator = true;
    this.watchlistService.addCoinToWatchlist(this.addCoinToWatchlistRequest);
  }


  ngOnDestroy(): void {
      this.binanceApiSubscription.unsubscribe();
      this.watchlistSubscription.unsubscribe();
  }


}
