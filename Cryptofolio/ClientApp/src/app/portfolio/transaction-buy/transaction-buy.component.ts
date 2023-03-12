import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { CoinBinance } from 'src/app/common/models/coin-models/coin-binance';
import { FinanceTransactionBuy } from 'src/app/common/models/transaction-models/finance-transaction-buy';
import { SyncfusionUtilsService } from 'src/app/common/syncfusion-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transaction-buy',
  templateUrl: './transaction-buy.component.html',
  styleUrls: ['./transaction-buy.component.css']
})
export class TransactionBuyComponent implements OnInit {


  public data!: DataManager;
  public query!: Query;
  @Output() isSumbitButtonClicked = new EventEmitter<boolean>();

  @Input("dialogType")  public dialogType: string = '';
  @Input("coinsBinance")  public coinsBinance: CoinBinance[] = [];
  @ViewChild('transactionBuyForm') public transactionBuyForm!: FormGroup;
  @Input("transactionBuy") public transactionBuy: FinanceTransactionBuy = {} as FinanceTransactionBuy;

  public dateValue: Date =  new Date();
  //Dropdown menu for Ticket Statuses
  public fieldsDropDownCoins: Object = {
    text: 'name',
    value: 'symbol',
  };
constructor(private syncfusionUtilsService: SyncfusionUtilsService) {
  this.data = new DataManager({
    url: environment.urlFinanceTransactionBuys,
    adaptor:  syncfusionUtilsService.getCustomSecureODataV4AdaptorPatch(),
    crossDomain: true,
  });

   this.query = new Query();
 }

ngOnInit(): void {
}

  //Click on button Sumbit
  onSubmit() {
    //Send updated request from edited residential association form
    console.log(this.dialogType);
    console.log("this.notifier");
    console.log(this.transactionBuy);
    var dataUpdate = this.transactionBuyForm.value as FinanceTransactionBuy;

    dataUpdate.Id = this.transactionBuy.Id;
    dataUpdate.ApplicationUserId = this.transactionBuy.ApplicationUserId;
    console.log(this.transactionBuyForm);
    if(this.dialogType == 'update'){
      console.log("In Update");
      console.log(dataUpdate);
      this.data.update("Id", dataUpdate);

    }

    if(this.dialogType == 'insert'){

    this.transactionBuy.ApplicationUserId = 'x';
    this.transactionBuy.Id = -1;
    this.data.insert(this.transactionBuy);
    }
    this.isSumbitButtonClicked.emit(true);




    this.transactionBuyForm.reset();
    // this.isEdit = false;
    // this.grid.refresh();
  }
}
