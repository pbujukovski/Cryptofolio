import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import {
  EditSettingsModel,
  GridComponent,
  PageSettingsModel,
  RowDataBoundEventArgs,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { DataManager, Query, ReturnOption } from '@syncfusion/ej2-data';
import { EmitType } from '@syncfusion/ej2/base';
import { convertStringToValue } from '@syncfusion/ej2/maps';
import { concatMap, Subscription, timer } from 'rxjs';
import { CoinBinance } from 'src/app/common/models/coin-models/coin-binance';
import { CoinTransactionSummary } from 'src/app/common/models/transaction-models/coin-transaction-summary';
import { FinanceTransaction } from 'src/app/common/models/transaction-models/finance-transaction';
import { Transaction } from 'src/app/common/models/transaction-models/transaction';
import { TransactionGrid } from 'src/app/common/models/transaction-models/transaction-grid.model';
import { TransactionType } from 'src/app/common/models/transaction-models/transaction-type.enum';
import { TransferTransaction } from 'src/app/common/models/transaction-models/transfer-transaction';
import { TransferTransactionIn } from 'src/app/common/models/transaction-models/transfer-transaction-in';
import { TransferTransactionOut } from 'src/app/common/models/transaction-models/transfer-transaction-out';
import { BinanceApiService } from 'src/app/common/services/binance-api.service';
import { PortfolioService } from 'src/app/common/services/portfolio.service';
import { SyncfusionUtilsService } from 'src/app/common/syncfusion-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css'],
})
export class TransactionDetailsComponent implements OnInit, OnDestroy {
  public coinSymbol: string = '';
  TransactionType = TransactionType;
  public dataManager: DataManager;
  public queryManager: Query;

  public transactionCurrent!: Transaction;
  public sliceIndex: number = -1;

  public isDetailsClicked: boolean = false;
  public targetElement!: HTMLElement;
  public isContentLoaded: boolean = false;
  public isDeleteContentClicked: boolean = false;
  public transactions: TransactionGrid[] = [];
  public transaction!: TransactionGrid;
  public transactionType :string = '';
  public dataTransaction!: Transaction;
  public transactionEdit !: FinanceTransaction;
  public transactionEditInOut !: TransferTransaction;
  public onEditClickedEvent : boolean = false;
  public dataArrived: boolean = false;
  // @ViewChild('ddl') ddl!: DropDownList;

  @ViewChild('dialog') dialog!: DialogComponent;
  @ViewChild('myGrid') grid?: GridComponent;
  // @ViewChild('grid', { static: true }) grid!: GridComponent;

  public coinTransactionSummary: CoinTransactionSummary =
    new CoinTransactionSummary();
  //Grid settings
  public editSettings!: EditSettingsModel;
  public toolbar!: ToolbarItems[] | object;
  public pageSettings!: PageSettingsModel;

  public coinBinance!: CoinBinance;

  public isFirstTimeSynchronization: boolean = true;
  public subscriptionBinance!: Subscription;
  public subscriptionBinance1!: Subscription;
  public subscriptionBinance2!: Subscription;

  private lastSearchTimeOut: number | null = null;
  private readonly searchTimeOutMs: number = 300;
  public previousValuesMap: Record<string, TransactionGrid> = {};

  constructor(
    private binanceApiService: BinanceApiService,
    private portfolioService: PortfolioService,
    private syncfusionUtilsService: SyncfusionUtilsService,
    private router: Router
  ) {
   this.subscriptionBinance = this.portfolioService.coinSymbol.subscribe((coinSymbol) => {
      //Get the coin symbol
      this.coinSymbol = coinSymbol;
      //Check if coin symbol is null redirect to porfolio
      if (this.coinSymbol === ''){
        this.router.navigate(['portfolio']);
      }

    });
    //Add timer to refresh data every 20sec
    const binanceApiObsearvable$ = timer(1000, 20000);


    //Set setings for Data Manager
    this.dataManager = new DataManager({
      url: environment.urlTransactions,
      adaptor: syncfusionUtilsService.getCustomSecureODataV4Adaptor(),
      crossDomain: true,
    });

    //Set query with parametar 'CoinSymbol'
    this.queryManager = new Query().addParams('CoinSymbol', this.coinSymbol);

    this.subscriptionBinance1 = binanceApiObsearvable$
    .pipe(concatMap(() => this.binanceApiService.getCoin(this.coinSymbol)))
    .subscribe();

    this.subscriptionBinance2 = this.binanceApiService.CoinUpdated.subscribe((data) => {
      this.coinBinance = data;
      this.getTransactions();
    });

  }

 public ngOnInit(): void {
    this.editSettings = {
      allowEditing: false,
      allowAdding: false,
      allowDeleting: true,
      mode: 'Dialog',
    };

    //Add search to toolbar
    this.toolbar = [];
  }

  public ngOnDestroy(): void {

    console.log("HEERRRREEEEEEEEEEEEEEEEEEEEEEE");
    this.subscriptionBinance.unsubscribe();
    this.subscriptionBinance1.unsubscribe();
    this.subscriptionBinance2.unsubscribe();
  }

  public getTransactions() {
    this.dataManager
      .executeQuery(this.queryManager)
      .then((e: ReturnOption) => {
        var resultList = e.result as TransactionGrid[];
        console.log(resultList);
        if (resultList != null) {
          this.transactions = resultList;
          console.log(this.transactions);
          this.Summary();
          // this.notifierUpdate.next(this.notifier);
        } else console.log('Result list is empty');
      })
      .catch((e) => true);

    console.log(this.transactions);
  }

  public Summary() {
    var amountSummary = 0;
    var avgBuyPrice = 0;
    var countBuyTransactions = 0;
    var calSumProfitLoss = 0;
    this.transactions.forEach((transaction) => {
      if (
        transaction['@odata.type'] == TransactionType.Buy ||
        transaction['@odata.type'] == TransactionType.In
      ) {
        amountSummary += transaction.Amount;
        if (transaction['@odata.type'] == TransactionType.Buy) {
          avgBuyPrice += transaction.Price * transaction.Amount;
          calSumProfitLoss += transaction.Price * transaction.Amount;
          countBuyTransactions += transaction.Amount;
        }
        else if (transaction['@odata.type'] == TransactionType.In){
          calSumProfitLoss += Number(this.coinBinance.lastPrice) * transaction.Amount;
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
          calSumProfitLoss -= Number(this.coinBinance.lastPrice) * transaction.Amount;
        }
      }
    });
    console.log("HEREEEEEEEEE");
    let num = Number(this.coinBinance.lastPrice);
    console.log(num);
    console.log(amountSummary);
    console.log(num * amountSummary);
    console.log(avgBuyPrice);
    console.log(avgBuyPrice - (num * amountSummary));
    this.coinTransactionSummary.ProfitLoss = (Number(this.coinBinance.lastPrice) * amountSummary) -  calSumProfitLoss;
    this.coinTransactionSummary.CoinSymbol = this.coinSymbol;
    this.coinTransactionSummary.Quantity = Number(amountSummary.toFixed(2));
    this.coinTransactionSummary.Price =
      amountSummary * Number(this.coinBinance.lastPrice);
      if (avgBuyPrice != 0 || countBuyTransactions != 0){
        this.coinTransactionSummary.AvgBuyPrice =
        avgBuyPrice / countBuyTransactions;
        console.log("(this.coinTransactionSummary.AvgBuyPrice");
        console.log(this.coinTransactionSummary.AvgBuyPrice);
      }
      else if (avgBuyPrice == 0 || countBuyTransactions == 0){
        this.coinTransactionSummary.AvgBuyPrice = 0;
        console.log("else");
        console.log(this.coinTransactionSummary.AvgBuyPrice);
      }
      console.log(this.coinTransactionSummary.AvgBuyPrice);
      if(this.coinTransactionSummary != null || this.coinTransactionSummary != undefined && this.coinBinance != null || this.coinBinance != undefined){
      if (this.coinBinance.iconPath.length > 0){
        const binanceApiObsearvable1$ = timer(1000, 5000);
        binanceApiObsearvable1$.subscribe(() => this.isContentLoaded = true)

      }
      }
  }

  public onDetailsClicked(data: RowDataBoundEventArgs) {
    console.log('data');
    console.log(data);
    this.transaction = data as TransactionGrid;
    this.isDetailsClicked = true;
    this.dialog!.show();
  }

  //Hide dialog component if on side is clicked
  public onOverlayClick: EmitType<object> = () => {
    this.isDetailsClicked = false;
    this.onEditClickedEvent = false;
     this.dialog!.hide();
  };

  public onBack() {
    this.router.navigate(['portfolio']);
  }
  public onDeleteClicked(data: Transaction) {
    console.log('data');
    console.log(data);
    let i = data as any;
    this.sliceIndex = i.index;
    this.isDeleteContentClicked = true;
    this.transactionCurrent = data;
  }

  public deleteSelectedContent(){
    console.log("HERE");
    console.log(this.sliceIndex);
    console.log(this.transactions.length);
    this.transactions.splice(this.sliceIndex,1);

    this.dataManager.remove('Id', this.transactionCurrent);
    this.isDeleteContentClicked = false;

    if (this.transactions.length == 0){
      this.onBack();
    }
    else if (this.transactions.length > 0){
      console.log(this.grid);
      this.grid!.refresh();
    }

  }


  public onEditClicked(data: RowDataBoundEventArgs) {
    console.log("Here ON EDIT CLICKED");
    console.log(data);

    this.dataTransaction = data as Transaction;
    this.transactionType = this.dataTransaction['@odata.type'];

    if (this.dataTransaction['@odata.type'] == TransactionType.Buy || this.dataTransaction['@odata.type'] == TransactionType.Sell)
    {
      this.transactionEdit = data as FinanceTransaction;
    }
    else if (this.dataTransaction['@odata.type'] == TransactionType.Out || this.dataTransaction['@odata.type'] == TransactionType.In)
    {
      this.transactionEditInOut = data as TransferTransaction;
    }
    this.onEditClickedEvent= true;
    this.dialog!.show();

  }

  public onSumbitButtonClicked(value: boolean){
    console.log("HEREE");
    this.onEditClickedEvent = false;
    if (value == true){
      this.dialog!.hide();
      // this.getTransactions();

      this.grid!.showSpinner();
      this.getTransactions();
    }
  }

  public onClose(){
    this.isDetailsClicked = false;
    this.onEditClickedEvent = false;
    this.isDeleteContentClicked = false;
    this.dialog!.hide();
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

      private clearSearchTimeOut(): void {
        // Clear any previues search refresh.
        if (this.lastSearchTimeOut != null) {
          clearTimeout(this.lastSearchTimeOut);
        }
      }
}
