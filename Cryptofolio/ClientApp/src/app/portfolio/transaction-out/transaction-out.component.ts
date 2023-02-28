import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { CoinBinance } from 'src/app/common/models/coin-models/coin-binance';
import { TransferTransactionOut } from 'src/app/common/models/transaction-models/transfer-transaction-out';
import { SyncfusionUtilsService } from 'src/app/common/syncfusion-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transaction-out',
  templateUrl: './transaction-out.component.html',
  styleUrls: ['./transaction-out.component.css']
})
export class TransactionOutComponent implements OnInit {
  public data!: DataManager;
  public query!: Query;

  @Input("coinsBinance")  public coinsBinance: CoinBinance[] = [];
  @ViewChild('transactionOutForm') public transactionOutForm!: FormGroup;
  public transactionOut: TransferTransactionOut = {} as TransferTransactionOut;

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
    console.log(this.transactionOut);

    this.transactionOut.ApplicationUserId = 'x';
    this.transactionOut.Id = -1;
    this.data.insert(this.transactionOut);
    this.transactionOutForm.reset();
    // this.isEdit = false;
    // this.grid.refresh();
  }

}
