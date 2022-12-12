import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  DialogEditEventArgs,
  EditSettingsModel,
  GridComponent,
  PageSettingsModel,
  QueryCellInfoEventArgs,
  SaveEventArgs,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { CoinBinance, coinBinanceV2 } from '../common/models/coin-binance';
import { cryptoSymbol } from 'crypto-symbol';
import { DataManager } from '@syncfusion/ej2-data';
import { NavigationEnd, Router } from '@angular/router';
import { BinanceApiService } from '../common/services/binance-api.service';

import { concatMap, interval, Subscription, switchMap, timer } from 'rxjs';
import { Watchlist } from '../common/models/watchlist';
import { WatchlistService } from '../common/services/watchlist.service';
import { Coin } from '../common/models/coin';
import { ChipListComponent } from '@syncfusion/ej2-angular-buttons';

const { nameLookup } = cryptoSymbol({});

@Component({
  selector: 'app-crypto-grid',
  templateUrl: './crypto-grid.component.html',
  styleUrls: ['./crypto-grid.component.css'],
})
export class CryptoGridComponent implements OnInit, OnDestroy {

  // public data: DataManager;
  public toolbarOptions!: ToolbarItems[];
  // public dataJson: Array<any> = new Array();

  //Data for all coins
  public data: CoinBinance[] = [];

  public testData: coinBinanceV2[] = [];
  public watchlist: Watchlist = new Watchlist();

  // @Output() variableEvent: EventEmitter<string> = new EventEmitter<string>();

  public pageSettings!: PageSettingsModel;
  public editSettings!: EditSettingsModel;
  public toolbar!: ToolbarItems[] | object;

  public binanceApiSubscription!: Subscription;
  @ViewChild('grid') public grid!: GridComponent;

  constructor(
    public binanceApiService: BinanceApiService,
    public router: Router,
    public watchlistService: WatchlistService
  ) {
    const binanceApiObsearvable$ = timer(1000, 10000);


    //Subscribe to get coins updated from Binance Service
    this.binanceApiSubscription = this.binanceApiService.CoinsUpdated.subscribe(
      (data) => {
        //Set data to data from binance service
        this.data = data;
      }
    );

    this.binanceApiService.getCoinsv2();
    this.binanceApiService.CoinsUpdatedv2.subscribe(test => {
      this.testData = test;
      console.log(this.testData);
    })
      // this.binanceApiService.comineData();
    binanceApiObsearvable$.pipe(concatMap(() => this.binanceApiService.getCoins())).subscribe();

  }

  ngOnInit(): void {

    //Set page size lenght for grid
    this.pageSettings = { pageSize: 12 };

    //Filter edit settings for grid
    this.editSettings = {
      allowEditing: false,
      allowAdding: false,
      allowDeleting: false,
      mode: 'Dialog',
    };

    //Add search to toolbar
    this.toolbar = ['Search'];
  }


public coinBinanceBackup: CoinBinance = new CoinBinance;
public previousValuesMap: Record<string, CoinBinance> = {};

  customiseCell(args: QueryCellInfoEventArgs) {

    let dataFromGrid = args.data as CoinBinance;

    if (args.column?.field ==='bidPrice') {

      const previousValue = this.previousValuesMap[dataFromGrid.symbol];
      if (previousValue){
        const lastPrice = isNaN(Number(previousValue.bidPrice.replace(/[^0-9.-]+/g,""))) ? 0 : Number(previousValue.bidPrice.replace(/[^0-9.-]+/g,""));
        const currentPrice = isNaN(Number(dataFromGrid.bidPrice.replace(/[^0-9.-]+/g,""))) ? 0 : Number(dataFromGrid.bidPrice.replace(/[^0-9.-]+/g,""));

    (args.cell as any ).style.color =   !lastPrice|| lastPrice === currentPrice ? 'black' : currentPrice > lastPrice ? 'green' : 'red';


  }


    this.coinBinanceBackup = dataFromGrid;
    this.previousValuesMap[dataFromGrid.symbol] = dataFromGrid;


    }



  }

  public selectedSymbol: string = '';

  public onDetailsClicked(args: any) {
    let test = this.grid.getRowInfo(args.target).rowData as CoinBinance;
    let selectedSymbol = test.symbol + 'USDT';
    //   console.log(selectedSymbol);

    this.selectedSymbol = test.symbol;
    console.log(this.selectedSymbol);
    this.binanceApiService.coinSymbol.next(this.selectedSymbol);
    // this.variableEvent.emit(this.selectedSymbol);
    this.router.navigate(['crypto-details']);
  }


  public coin: Coin = new Coin();
  public onAddToWatchlist(args: any) {
    console.log("this.selectedSymbol");
    let test = this.grid.getRowInfo(args.target).rowData as CoinBinance;
    let selectedSymbol = test.symbol + 'USDT';
    this.selectedSymbol = test.symbol;
    console.log(this.selectedSymbol);

    this.coin.Symbol = this.selectedSymbol;

    console.log(this.coin);

    this.watchlist.Coins.push(this.coin);
    this.watchlistService.addCoinToWatchlist(this.watchlist);
  }

  ngOnDestroy() {
    this.binanceApiSubscription.unsubscribe();
  }
}
