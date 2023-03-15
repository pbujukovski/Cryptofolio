import { Component, OnInit, ViewChild } from '@angular/core';
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
import { BinanceApiService } from 'src/app/common/services/binance-api.service';
import { PortfolioService } from 'src/app/common/services/portfolio.service';
import { SyncfusionUtilsService } from 'src/app/common/syncfusion-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css'],
})
export class TransactionDetailsComponent implements OnInit {
  public coinSymbol: string = '';
  TransactionType = TransactionType;
  public dataManager: DataManager;
  public queryManager: Query;

  public transactionCurrent!: Transaction;

  public isDetailsClicked: boolean = false;
  public targetElement!: HTMLElement;
  public isContentLoaded: boolean = false;
  public isDeleteContentClicked: boolean = false;
  public transactions: TransactionGrid[] = [];
  public transaction!: TransactionGrid;

  // @ViewChild('ddl') ddl!: DropDownList;

  @ViewChild('dialog') dialog!: DialogComponent;
  @ViewChild('gird') grid! : GridComponent;

  public coinTransactionSummary: CoinTransactionSummary =
    new CoinTransactionSummary();
  //Grid settings
  public editSettings!: EditSettingsModel;
  public toolbar!: ToolbarItems[] | object;
  public pageSettings!: PageSettingsModel;

  public coinBinance: CoinBinance = new CoinBinance();

  public subscriptionBinance: Subscription;
  constructor(
    private binanceApiService: BinanceApiService,
    private portfolioService: PortfolioService,
    private syncfusionUtilsService: SyncfusionUtilsService,
    private router: Router
  ) {
    this.portfolioService.coinSymbol.subscribe((coinSymbol) => {
      //Get the coin symbol
      this.coinSymbol = coinSymbol;
      //Check if coin symbol is null redirect to porfolio
      if (this.coinSymbol === ''){
        this.router.navigate(['portfolio']);
      }

    });
    //Add timer to refresh data every 20sec
    const binanceApiObsearvable$ = timer(0, 20000);

    //Set setings for Data Manager
    this.dataManager = new DataManager({
      url: environment.urlTransactions,
      adaptor: syncfusionUtilsService.getCustomSecureODataV4Adaptor(),
      crossDomain: true,
    });

    //Set query with parametar 'CoinSymbol'
    this.queryManager = new Query().addParams('CoinSymbol', this.coinSymbol);

    //Subscribe to get the coins from binance api service
    this.subscriptionBinance = binanceApiObsearvable$
      .pipe(concatMap(() => this.binanceApiService.getCoin(this.coinSymbol)))
      .subscribe(() => {
        this.binanceApiService.CoinUpdated.subscribe((data) => {
          this.coinBinance = data;
          //Get the data for transactions
          this.getTransactions();
        });
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
    this.transactions.forEach((transaction) => {
      if (
        transaction['@odata.type'] == TransactionType.Buy ||
        transaction['@odata.type'] == TransactionType.In
      ) {
        amountSummary += transaction.Amount;
        if (transaction['@odata.type'] == TransactionType.Buy) {
          avgBuyPrice += transaction.Price * transaction.Amount;
          countBuyTransactions += transaction.Amount;
        }
      } else if (
        transaction['@odata.type'] == TransactionType.Sell ||
        transaction['@odata.type'] == TransactionType.Out
      ) {
        amountSummary -= transaction.Amount;
      }
    });
    this.coinTransactionSummary.CoinSymbol = this.coinSymbol;
    this.coinTransactionSummary.Quantity = amountSummary;
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
    this.isContentLoaded = true;
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
    this.isDeleteContentClicked = true;
    this.transactionCurrent = data;
  }

  public deleteSelectedContent(){

    this.dataManager.remove('Id', this.transactionCurrent);
    this.isDeleteContentClicked = false;
    this.grid.refresh();
  }

  public transactionType :string = '';
  public dataTransaction!: Transaction;
  public transactionEdit !: FinanceTransaction;
  public onEditClickedEvent : boolean = false;
  public onEditClicked(data: RowDataBoundEventArgs) {
    console.log("Here ON EDIT CLICKED");
    console.log(data);
    this.dataTransaction = data as Transaction;
    this.transactionType = this.dataTransaction['@odata.type'];

    if (this.dataTransaction['@odata.type'] == TransactionType.Buy)
    {
      this.transactionEdit = data as FinanceTransaction;
    }
    if (this.dataTransaction['@odata.type'] == TransactionType.Sell)
    {
      this.transactionEdit = data as FinanceTransaction;
    }

    this.onEditClickedEvent= true;
    this.dialog.show;
  }

  public onSumbitButtonClicked(value: boolean){
    console.log("HEREE");
    this.onEditClickedEvent = false;
    if (value == true){
      this.dialog!.hide();
      this.getTransactions();
      this.grid.refresh();
    }
  }

  public onClose(){
    this.isDetailsClicked = false;
    this.onEditClickedEvent = false;
    this.isDeleteContentClicked = false;
    this.dialog!.hide();
  }

}
