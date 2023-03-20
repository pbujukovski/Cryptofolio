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
  SearchSettings,
  SearchSettingsModel,
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

  private lastSearchTimeOut: number | null = null;
  private readonly searchTimeOutMs: number = 300;
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

    // Search

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

    this.coin.Symbol = coinToWatchlist.symbol;

    var exists =  this.dataWatchlist.Coins.some(coinExists => coinToWatchlist.symbol == coinExists.Symbol);

    if(exists == true){
      const index = this.dataWatchlist.Coins.findIndex(coinExists => coinToWatchlist.symbol == coinExists.Symbol);
      this.dataWatchlist.Coins.splice(index,1);
    }
    else{
      this.dataWatchlist.Coins.push(this.coin);
    }

    this.watchlistService.WatchlistUpdate.next(this.dataWatchlist);
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
  public imageUrl : string = ''
  handleImageError(event: Event): void {
    event.preventDefault();
    this.imageUrl = '../../assets/default.png';
  }
}
