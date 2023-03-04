import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType, isNullOrUndefined, detach } from '@syncfusion/ej2/base';
import { DataManager, Query, ReturnOption } from '@syncfusion/ej2-data';
import { concatMap, Subscription, timer } from 'rxjs';
import { CoinBinance } from '../common/models/coin-models/coin-binance';
import { BinanceApiService } from '../common/services/binance-api.service';
import { Transaction } from '../common/models/transaction-models/transaction';
import { environment } from 'src/environments/environment';
import { SyncfusionUtilsService } from '../common/syncfusion-utils';
import { EditSettingsModel, ToolbarItems, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { CoinTransactionSummary } from '../common/models/transaction-models/coin-transaction-summary';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {
  @ViewChild('ddl') ddl!: DropDownList;
  @ViewChild('dialog') dialog!: DialogComponent;
  public targetElement!: HTMLElement;
  public binanceApiSubscription!: Subscription;
  public isNewTransactionBtnClicked: boolean = false;
  public selectedFormValue: string = 'Buy';


  public dataTransactions!: DataManager;
  public queryTransactions!: Query;
  public transactions: Transaction[] = [];
  public coinTransactionSummary: CoinTransactionSummary[] = [];
  public editSettings!: EditSettingsModel;
  public toolbar!: ToolbarItems[] | object;
  public pageSettings!: PageSettingsModel;
  //Dropdown menu for Ticket Statuses
  public fieldsDropDownCoins: Object = {
    text: 'name',
    value: 'symbol',
  };

  getButtonClass(selectedFormValue  : string) {
    return this.selectedFormValue === selectedFormValue ? 'selected' : '';
  }
  public data: CoinBinance[] = [];
  public coinSymbol: string = '';

  onChange(args: any) {
    console.log(args.value);
  }

  constructor(private binanceApiService: BinanceApiService, private syncfusionUtilsService: SyncfusionUtilsService) {

    this.dataTransactions = new DataManager({
      url: environment.urlTransactions,
      adaptor:  syncfusionUtilsService.getCustomSecureODataV4Adaptor(),
      crossDomain: true,
    });

    this.queryTransactions = new Query();
    this.getTransactions();

    const binanceApiObsearvable$ = timer(1000, 1000000);
    //Subscribe to get coins updated from Binance Service
    this.binanceApiSubscription = this.binanceApiService.CoinsUpdated.subscribe(
      (data) => {
        //Set data to data from binance service
        this.data = data;
      }
    );
    this.binanceApiSubscription = this.binanceApiService.getCoins().subscribe();
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

  getTransactions(){
    this.dataTransactions
    .executeQuery(this.queryTransactions)
    .then((e: ReturnOption) => {
      var resultList = e.result as Transaction[];
      if (resultList != null ) {
        this.transactions = resultList;
        console.log("CoinTransactionSummary");
        console.log(this.coinTransactionSummary);
      } else console.log('Result list is empty');
    })
    .catch((e) => true);
  }

  onAddNewTransaction() {
    this.isNewTransactionBtnClicked = true;
    this.dialog.show();
  }

  onChangeFormModel(value: string) {
    this.selectedFormValue = value;
  }

  //Hide dialog component if on side is clicked
  public onOverlayClick: EmitType<object> = () => {
    this.isNewTransactionBtnClicked = false;
    this.dialog.hide();
  };
}
