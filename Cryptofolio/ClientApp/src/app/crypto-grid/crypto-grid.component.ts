import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  EditSettingsModel,
  GridComponent,
  PageSettingsModel,
  QueryCellInfoEventArgs,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { CoinBinance } from '../common/models/coin-models/coin-binance';
import { cryptoSymbol } from 'crypto-symbol';
import { Router } from '@angular/router';
import { BinanceApiService } from '../common/services/binance-api.service';
import { concatMap, Subscription, switchMap, timer } from 'rxjs';
import {
  AddCoinToWatchlistRequest,
  Watchlist,
} from '../common/models/watchlist';
import { WatchlistService } from '../common/services/watchlist.service';
import { Coin } from '../common/models/coin-models/coin';

const { nameLookup } = cryptoSymbol({});

@Component({
  selector: 'app-crypto-grid',
  templateUrl: './crypto-grid.component.html',
  styleUrls: ['./crypto-grid.component.css'],
})
export class CryptoGridComponent implements OnInit, OnDestroy {
  // public data: DataManager;
  public toolbarOptions!: ToolbarItems[];

  //Data for all coins
  public data: CoinBinance[] = [];
  public selectedSymbol: string = '';
  public coin: Coin = new Coin();
  public watchlist: Watchlist = new Watchlist(-1, [], '');
  public starIndicator: boolean = false;
  public addCoinToWatchlistRequest: AddCoinToWatchlistRequest =
    new AddCoinToWatchlistRequest();
  public pageSettings!: PageSettingsModel;
  public editSettings!: EditSettingsModel;
  public toolbar!: ToolbarItems[] | object;
  public isInWishlist: boolean = false;
  public coinBinanceBackup: CoinBinance = new CoinBinance();
  //Subscriptions
  public binanceApiSubscription!: Subscription;
  public watchlistSubscription!: Subscription;
  public dataWatchlist!: Watchlist;


  public previousValuesMap: Record<string, CoinBinance> = {};
  @ViewChild('grid') public grid!: GridComponent;

  constructor(
    public binanceApiService: BinanceApiService,
    public router: Router,
    public watchlistService: WatchlistService
  ) {
    const binanceApiObsearvable$ = timer(1000, 20000);

    //Subscribe to get coins updated from Binance Service
    this.binanceApiSubscription = this.binanceApiService.CoinsUpdated.subscribe(
      (data) => {
        //Set data to data from binance service
        this.data = data;
      }
    );

    //Get Watchlist from sevice
    this.watchlistService.getWatchList();

    //Subscribe to get wathclist updated from Watchlist Service
    this.watchlistSubscription =
      this.watchlistService.WatchlistUpdate.subscribe((watchlist) => {
        this.dataWatchlist = watchlist;
      });

    this.binanceApiSubscription = binanceApiObsearvable$
      .pipe(concatMap(() => this.binanceApiService.getCoins()))
      .subscribe();
  }

  ngOnInit(): void {
    //Set page size lenght for grid
    this.pageSettings = { pageSize: 10 };

    //Filter edit settings for grid
    this.editSettings = {
      allowEditing: false,
      allowAdding: false,
      allowDeleting: false,
      mode: 'Dialog',
    };

    //Add search to toolbar
    this.toolbar = ['Search'];

    this.data.filter((test) =>
      this.dataWatchlist.Coins.some((coinSymbol) => {
        if (coinSymbol.Symbol === test.symbol) {
          this.isInWishlist = true;
        }
      })
    );
  }

  //Check if COIN pair is added to watchlist
  public setCheckedValue(coinSymbol: string): boolean {
    return this.dataWatchlist.Coins.find((c) => c.Symbol == coinSymbol) != null;
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

  //When we click details on coin symbol
  public onDetailsClicked(args: any) {
    //Step 1: Get coin details from grid row
    let coinToDetails = this.grid.getRowInfo(args.target)
      .rowData as CoinBinance;

    //Step 2: Assign selected symbol to this.selectedSymbol
    this.selectedSymbol = coinToDetails.symbol;
        //Step 2.2: Notify change and send updaded symbol
        this.binanceApiService.coinSymbol.next(this.selectedSymbol);

    //Step 3: Navigate to crypto-details
    this.router.navigate(['crypto-details']);
  }

   //When we add symbol to watchlist
  public onAddToWatchlist(args: any) {
   //Step 1: Get coin details from grid row
    let coinToWatchlist = this.grid.getRowInfo(args.target)
      .rowData as CoinBinance;
    //Step 2: Assign selected symbol to this.selectedSymbol
    this.addCoinToWatchlistRequest.CoinSymbol = coinToWatchlist.symbol;
    //Step 2.2: Assign selected symbol StarIndicator to true;
    this.addCoinToWatchlistRequest.StarIndicator = true;
    //Step 3: Send request to update backend watchlist;
    this.watchlistService.addCoinToWatchlist(this.addCoinToWatchlistRequest);
  }

  ngOnDestroy() {
    //Unsibscribe
    this.binanceApiSubscription.unsubscribe();

    this.watchlistSubscription.unsubscribe();
  }
}
