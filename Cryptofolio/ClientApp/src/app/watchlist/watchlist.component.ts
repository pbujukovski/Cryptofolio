import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChipListComponent } from '@syncfusion/ej2-angular-buttons';
import { EditSettingsModel, GridComponent, PageSettingsModel, QueryCellInfoEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor, Query, ReturnOption } from '@syncfusion/ej2-data';
import { BehaviorSubject, concatMap, Subject, Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coin } from '../common/models/coin-models/coin';
import { CoinBinance } from '../common/models/coin-models/coin-binance';
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

  public dataGridChanged : Subject<CoinBinance[]> = new Subject<CoinBinance[]>();

  private lastSearchTimeOut: number | null = null;
  private readonly searchTimeOutMs: number = 300;
  public previousValuesMap: Record<string, CoinBinance> = {};
  public coinBinanceBackup: CoinBinance = new CoinBinance();

  @ViewChild('grid') public grid!: GridComponent;
  constructor(public binanceApiService: BinanceApiService,public watchlistService: WatchlistService, public router: Router) {
    const binanceApiObsearvable$ = timer(500, 15000);
    this.watchlistService.getWatchList();

   this.watchlistSubscription = this.watchlistService.WatchlistUpdate.subscribe(watchlist => {

     this.dataWatchlist = watchlist;

    });


    this.binanceApiSubscription =  binanceApiObsearvable$
    .pipe(concatMap(() => this.binanceApiService.getCoins()))
    .subscribe();

    this.binanceApiSubscription = this.binanceApiService.CoinsUpdated.subscribe(coins => {
      this.dataCoins = coins;

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


    this.grid.deleteRecord('symbol', data);
    this.grid.refresh();
    let watchlistCoin = data.symbol as unknown as Coin;
    const index = this.dataWatchlist.Coins.indexOf(watchlistCoin);
    console.log(this.dataWatchlist);
    this.dataWatchlist.Coins.splice(index, 1);
    console.log(this.dataWatchlist.Coins);
    this.addCoinToWatchlistRequest.CoinSymbol = data.symbol;
    this.addCoinToWatchlistRequest.StarIndicator = true;
    this.watchlistService.addCoinToWatchlist(this.addCoinToWatchlistRequest);
  }


  ngOnDestroy(): void {
      this.binanceApiSubscription.unsubscribe();
      this.watchlistSubscription.unsubscribe();
  }

    //Change color for price when data is updated
    customiseCell(args: QueryCellInfoEventArgs) {
      let dataFromGrid = args.data as CoinBinance;

      if (args.column?.field === 'bidPrice') {
        const previousValue = this.previousValuesMap[dataFromGrid.symbol];
        if (previousValue) {
          const lastPrice = isNaN(
            Number(previousValue.bidPrice.replace(/[^0-9.-]+/g, ''))
          )
            ? 0
            : Number(previousValue.bidPrice.replace(/[^0-9.-]+/g, ''));
          const currentPrice = isNaN(
            Number(dataFromGrid.bidPrice.replace(/[^0-9.-]+/g, ''))
          )
            ? 0
            : Number(dataFromGrid.bidPrice.replace(/[^0-9.-]+/g, ''));

          (args.cell as any).style.color =
            !lastPrice || lastPrice === currentPrice
              ? 'black'
              : currentPrice > lastPrice
              ? 'green'
              : 'red';
        }
        this.coinBinanceBackup = dataFromGrid;
        this.previousValuesMap[dataFromGrid.symbol] = dataFromGrid;
      }
    }


  public created(args: any) {
    // Add Clear search button
    var gridElement = this.grid.element;

    // Set global search listener.
    (document.getElementById(this.grid.element.id + "_searchbar") as HTMLInputElement).oninput = (e: Event) => {
      // Clear any previues search refresh.
      this.clearSearchTimeOut();
      var searchText: string = (e.target as HTMLInputElement).value;
      if (searchText != "") {
        // Set timer for next serach refresh
        this.lastSearchTimeOut = window.setTimeout((searchText: string) => {
          this.grid.search(searchText);
          this.lastSearchTimeOut = null;
        }, this.searchTimeOutMs, searchText);
      } else {
        this.grid.searchSettings.key = "";
      }
    };
    // Add Last update info
    var spanLastUpdateInfo = document.createElement("span");
    spanLastUpdateInfo.id = gridElement.id + "_spanToolbarLastUpdateTime";
    spanLastUpdateInfo.className = "ms-2";
    gridElement.querySelector(".e-toolbar-items .e-toolbar-left")!.appendChild(spanLastUpdateInfo);
  }
    // Action for Clear Search button
    public onCancelBtnClick(args: any) {
      // Cancel if any search
      if (this.lastSearchTimeOut != null) {
        clearTimeout(this.lastSearchTimeOut);
      }
      this.grid.searchSettings.key = "";
      (this.grid.element.querySelector(".e-input-group.e-search .e-input") as any).value = "";
    }

  private clearSearchTimeOut(): void {
    // Clear any previues search refresh.
    if (this.lastSearchTimeOut != null) {
      clearTimeout(this.lastSearchTimeOut);
    }
  }


}
