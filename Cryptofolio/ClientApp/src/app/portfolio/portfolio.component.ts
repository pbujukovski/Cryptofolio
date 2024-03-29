import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType, isNullOrUndefined, detach } from '@syncfusion/ej2/base';
import { DataManager, Query, ReturnOption } from '@syncfusion/ej2-data';
import { concatMap, Subscription, switchMap, timer } from 'rxjs';
import { CoinBinance } from '../common/models/coin-models/coin-binance';
import { BinanceApiService } from '../common/services/binance-api.service';
import { Transaction } from '../common/models/transaction-models/transaction';
import { environment } from 'src/environments/environment';
import { SyncfusionUtilsService } from '../common/syncfusion-utils';
import {
  EditSettingsModel,
  ToolbarItems,
  PageSettingsModel,
  GridComponent,
  RowDataBoundEventArgs,
  FilterSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import {
  CoinTransactionSummary,
  TransactionSummaryGrid,
} from '../common/models/transaction-models/coin-transaction-summary';
import { PortfolioService } from '../common/services/portfolio.service';
import { Router } from '@angular/router';
import { TransactionType } from '../common/models/transaction-models/transaction-type.enum';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit, OnDestroy {
  @ViewChild('ddl') ddl!: DropDownList;
  @ViewChild('dialog') dialog?: DialogComponent;
  @ViewChild('myGrid') public grid?: GridComponent;
  public targetElement!: HTMLElement;
  public binanceApiSubscription!: Subscription;
  public subscriptionBinance: Subscription;
  public isNewTransactionBtnClicked: boolean = false;
  public selectedFormValue: string = 'Buy';

  public sumBallance: number = 0;
  public isDataReady: boolean = false;
  public transactionGridSummary: TransactionSummaryGrid =
    new TransactionSummaryGrid();
  public transactionSummaryGrid: TransactionSummaryGrid[] = [];
  public dataTransactions!: DataManager;
  public queryTransactions!: Query;
  public transactions: Transaction[] = [];
  public coinTransactionSummary: CoinTransactionSummary[] = [];
  public editSettings!: EditSettingsModel;
  public toolbar!: ToolbarItems[] | object;
  public pageSettings!: PageSettingsModel;

  private lastSearchTimeOut: number | null = null;
  private readonly searchTimeOutMs: number = 300;
  public previousValuesMap: Record<string, CoinBinance> = {};

  public filterOption: FilterSettingsModel = { type: 'Menu' };
  //Dropdown menu for Ticket Statuses
  public fieldsDropDownCoins: Object = {
    text: 'name',
    value: 'symbol',
  };

  getButtonClass(selectedFormValue: string) {
    return this.selectedFormValue === selectedFormValue ? 'selected' : '';
  }
  public data: CoinBinance[] = [];
  public coinsFilterd: CoinBinance[] = [];
  public dataCoin: CoinBinance | undefined = new CoinBinance();
  public coinSymbol: string = '';

  onChange(args: any) {
    console.log(args.value);
  }

  constructor(
    private portfolioService: PortfolioService,
    private binanceApiService: BinanceApiService,
    private syncfusionUtilsService: SyncfusionUtilsService,
    private router: Router
  ) {
    this.dataTransactions = new DataManager({
      url: environment.urlTransactions,
      adaptor: syncfusionUtilsService.getCustomSecureODataV4Adaptor(),
      crossDomain: true,
    });

    this.queryTransactions = new Query();

    const binanceApiObsearvable$ = timer(1000, 20000);


    // this.subscriptionBinance = this.binanceApiService.CoinsUpdated.subscribe((data) => {
    //   this.data = data;
    //   this.getTransactions();
    // });

    // this.subscriptionBinance = binanceApiObsearvable$
    // .pipe(concatMap(() => this.binanceApiService.getCoins()))
    // .subscribe();


  this.subscriptionBinance = binanceApiObsearvable$
  .pipe(
    switchMap(() => this.binanceApiService.getCoins()),
    switchMap((coinsBinance) => {
      this.data = coinsBinance;
      return this.binanceApiService.CoinsUpdated;
    })
  )
  .subscribe(() => {
    this.getTransactions();
  });
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

  ngOnDestroy(): void {
    console.log("   this.binanceApiSubscription.unsubscribe();    this.binanceApiSubscription.unsubscribe();    this.binanceApiSubscription.unsubscribe();    this.binanceApiSubscription.unsubscribe();    this.binanceApiSubscription.unsubscribe();")
    this.subscriptionBinance.unsubscribe();
  }

  getTransactions() {
    console.log('HERE QUERY');
    console.log(this.queryTransactions);

    this.dataTransactions
      .executeQuery(this.queryTransactions)
      .then((e: ReturnOption) => {
        var resultList = e.result as Transaction[];
        if (resultList != null) {
          this.transactions = resultList;
          console.log('CoinTransactionSummary');
          console.log(this.transactions);
          this.transactionSummaryGrid = [];
          const groupedTransactions = this.transactions.reduce(
            (groups: any, transaction: Transaction) => {
              if (!groups[transaction.CoinSymbol]) {
                groups[transaction.CoinSymbol] = [];
              }
              groups[transaction.CoinSymbol].push(transaction);
              return groups;
            },
            {}
          );

          console.log(groupedTransactions);
          var priceSum = 0;
          var amountSum = 0;

          this.binanceApiSubscription =
            this.binanceApiService.CoinsUpdated.subscribe((coins) => {
              this.data = coins;
              this.coinsFilterd = this.data.filter((data) =>
                this.transactions.some(
                  (coinSymbol) => coinSymbol.CoinSymbol === data.symbol
                )
              );
            });

          var sumBallance = 0;
          for (const transaction in groupedTransactions) {
            var amountSummary = 0;
            var avgBuyPrice = 0;
            var countBuyTransactions = 0;
            var calSumProfitLoss = 0;
            var transactionGridSummary: TransactionSummaryGrid =
              new TransactionSummaryGrid();

            console.log('groupedTransactions');
            console.log(groupedTransactions);
            let test = new CoinBinance();
            console.log(transaction);
            console.log(transaction.length);
            console.log(test);
            console.log(`People in ${transaction}:`);

            groupedTransactions[transaction].forEach((transaction: any) => {
              var dataCoin = this.coinsFilterd.find(
                (value) => value.symbol == transaction.CoinSymbol
              );
              this.dataCoin = dataCoin;
              console.log(
                this.coinsFilterd.find((value) => value.symbol == transaction)
              );
              console.log('dataCoin');
              console.log(dataCoin);

              console.log(transactionGridSummary);
              transactionGridSummary.CoinSymbol = transaction.CoinSymbol;
              // if (transaction['@odata.type'] == TransactionType.Buy){
              //   avgBuyPrice += transaction.Price * transaction.Amount;
              //   countBuyTransactions += transaction.Amount;
              // }
              if (
                transaction['@odata.type'] == TransactionType.Buy ||
                transaction['@odata.type'] == TransactionType.In
              ) {
                amountSummary += transaction.Amount;
                if (transaction['@odata.type'] == TransactionType.Buy) {
                  avgBuyPrice += transaction.Price * transaction.Amount;
                  countBuyTransactions += transaction.Amount;
                  calSumProfitLoss += transaction.Price * transaction.Amount;
                }
                else if (transaction['@odata.type'] == TransactionType.In){
                  calSumProfitLoss += Number(this.dataCoin?.lastPrice) * transaction.Amount;
                }
              } else if (
                transaction['@odata.type'] == TransactionType.Sell ||
                transaction['@odata.type'] == TransactionType.Out
              ) {
                amountSummary -= transaction.Amount;
                if (transaction['@odata.type'] == TransactionType.Sell){
                  calSumProfitLoss -= transaction.Price * transaction.Amount;
                }
                else if (transaction['@odata.type'] == TransactionType.Out){
                  calSumProfitLoss -= Number(this.dataCoin?.lastPrice) * transaction.Amount;
                }
              }
            });
            transactionGridSummary.PercentageChange =
              this.dataCoin!.priceChangePercent;
            transactionGridSummary.Quantity = Number(amountSummary.toFixed(2));
            transactionGridSummary.HoldingsPrice =
              amountSummary * Number(this.dataCoin!.lastPrice);
              transactionGridSummary.ProfitLoss =  (transactionGridSummary.Quantity * Number(this.dataCoin!.lastPrice)) - calSumProfitLoss;
            transactionGridSummary.ImgPath = this.dataCoin!.iconPath;
            transactionGridSummary.Price = this.dataCoin!.bidPrice;
            transactionGridSummary.CoinName = this.dataCoin!.name;
            sumBallance += transactionGridSummary.HoldingsPrice;

            if (avgBuyPrice != 0 || countBuyTransactions != 0) {
              transactionGridSummary.AvgBuyPrice =
                avgBuyPrice / countBuyTransactions;
              console.log('(this.coinTransactionSummary.AvgBuyPrice');
              console.log(transactionGridSummary.AvgBuyPrice);
            } else if (avgBuyPrice == 0 || countBuyTransactions == 0) {
              transactionGridSummary.AvgBuyPrice = 0;
              console.log('else');
              console.log(transactionGridSummary.AvgBuyPrice);
            }
            this.sumBallance = sumBallance;
            this.transactionGridSummary = transactionGridSummary;
            this.transactionSummaryGrid.push(this.transactionGridSummary);

          }
          this.isDataReady = true;
        } else console.log('Result list is empty');
      })
      .catch((e) => true);
  }


  onAddNewTransaction() {
    this.isNewTransactionBtnClicked = true;
    // this.dialog.show();
  }

  onClose() {
    this.isNewTransactionBtnClicked = false;
    // this.dialog.hide();
  }

  onChangeFormModel(value: string) {
    this.selectedFormValue = value;
  }

  //Hide dialog component if on side is clicked
  public onOverlayClick: EmitType<object> = () => {
    this.isNewTransactionBtnClicked = false;
    // this.dialog.hide();
  };

  public onDetailsClicked(args: RowDataBoundEventArgs) {
    // let test = this.grid.getRowInfo(args.target).rowData as CoinBinance;
    console.log(args as CoinTransactionSummary);
    let data = args as CoinTransactionSummary;
    this.binanceApiService.coinSymbol.next(data.CoinSymbol);
    this.router.navigate(['transaction-details']);
  }

  public onSumbitButtonClicked(value: boolean) : void {
    console.log("HEREEEEEEEEEEEEEEE onSumbitButtonClicked =>>>>>>>>>>>>>>>>");
    console.log(this.grid);

    // this.grid!.refresh();
    // this.grid!.refreshColumns();
    if (value == true) {
      this.grid!.showSpinner();
      this.getTransactions();
      this.isNewTransactionBtnClicked = false;
      this.dialog!.hide();
    }
  }

    // Search
    public created(args: any) {
      // Add Clear search button
      var gridElement = this.grid!.element;
      // Set global search listener.
      (document.getElementById(this.grid!.element.id + "_searchbar") as HTMLInputElement).oninput = (e: Event) => {
        // Clear any previues search refresh.
        this.clearSearchTimeOut();
        var searchText: string = (e.target as HTMLInputElement).value;
        if (searchText != "") {
          // Set timer for next serach refresh
          this.lastSearchTimeOut = window.setTimeout((searchText: string) => {
            this.grid!.search(searchText);
            this.lastSearchTimeOut = null;
          }, this.searchTimeOutMs, searchText);
        } else {
          this.grid!.searchSettings.key = "";
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
        this.grid!.searchSettings.key = "";
        (this.grid!.element.querySelector(".e-input-group.e-search .e-input") as any).value = "";
      }

    private clearSearchTimeOut(): void {
      // Clear any previues search refresh.
      if (this.lastSearchTimeOut != null) {
        clearTimeout(this.lastSearchTimeOut);
      }
    }

}
