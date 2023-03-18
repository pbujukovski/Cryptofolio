import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  @Output() isSumbitButtonClicked = new EventEmitter<boolean>();

  @Input('dialogType') public dialogType: string = '';
  @Input("coinsBinance")  public coinsBinance: CoinBinance[] = [];
  @Input("coinBinance")  public coinBinance!: CoinBinance;
  @ViewChild('transactionInForm') public transactionInForm!: FormGroup;
  @Input("transactionIn") public transactionIn: TransferTransactionIn = {} as TransferTransactionIn;

  public dateValue: Date =  new Date();
  //Dropdown menu for Ticket Statuses
  public fieldsDropDownCoins: Object = {
    text: 'name',
    value: 'symbol',
  };
constructor(private syncfusionUtilsService: SyncfusionUtilsService) {
  this.data = new DataManager({
    url: environment.urlTransferTransactionIns,
    adaptor:  syncfusionUtilsService.getCustomSecureODataV4AdaptorPatch(),
    crossDomain: true,
  });

   this.query = new Query();
 }

ngOnInit(): void {
  if (
    this.transactionIn.Date == null &&
    this.transactionIn.Date == undefined
  ) {
    this.transactionIn.Date = this.dateValue;
  }
}

  //Click on button Sumbit
  //Click on button Sumbit
  onSubmit() {
    //Send updated request from edited residential association form
    var dataUpdate = this.transactionInForm.value as TransferTransactionIn;

    dataUpdate.Id = this.transactionIn.Id;
    dataUpdate.ApplicationUserId = this.transactionIn.ApplicationUserId;

    if (this.dialogType == 'update') {
      console.log('In Update');
      console.log(dataUpdate);
      this.data.update('Id', dataUpdate);
    }

    if (this.dialogType == 'insert') {
      this.transactionIn.ApplicationUserId = 'x';
      this.transactionIn.Id = -1;
      this.data.insert(this.transactionIn);
    }
    this.isSumbitButtonClicked.emit(true);
    this.transactionInForm.reset();

    // this.isEdit = false;
    // this.grid.refresh();
  }
}
