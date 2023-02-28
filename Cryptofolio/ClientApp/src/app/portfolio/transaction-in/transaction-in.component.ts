import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataManager , Query } from '@syncfusion/ej2-data';
import { CoinBinance } from 'src/app/common/models/coin-models/coin-binance';
import { TransferTransactionIn } from 'src/app/common/models/transaction-models/transfer-transaction-in';
import { SyncfusionUtilsService } from 'src/app/common/syncfusion-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transaction-in',
  templateUrl: './transaction-in.component.html',
  styleUrls: ['./transaction-in.component.css']
})
export class TransactionInComponent implements OnInit {
  public data!: DataManager;
  public query!: Query;

  @Input("coinsBinance")  public coinsBinance: CoinBinance[] = [];
  @ViewChild('transactionInForm') public transactionInForm!: FormGroup;
  public transactionIn: TransferTransactionIn = {} as TransferTransactionIn;

  public dateValue: Date =  new Date();
  //Dropdown menu for Ticket Statuses
  public fieldsDropDownCoins: Object = {
    text: 'name',
    value: 'symbol',
  };
constructor(private syncfusionUtilsService: SyncfusionUtilsService) {
  this.data = new DataManager({
    url: environment.urlTransferTransactionIns,
    adaptor:  syncfusionUtilsService.getCustomSecureODataV4Adaptor(),
    crossDomain: true,
  });

   this.query = new Query();
 }

ngOnInit(): void {
}

  //Click on button Sumbit
  onSubmit() {
    //Send updated request from edited residential association form
    console.log("this.notifier");
    console.log(this.transactionIn);

    this.transactionIn.ApplicationUserId = 'x';
    this.transactionIn.Id = -1;
    this.data.insert(this.transactionIn);
    this.transactionInForm.reset();
    // this.isEdit = false;
    // this.grid.refresh();
  }
}
