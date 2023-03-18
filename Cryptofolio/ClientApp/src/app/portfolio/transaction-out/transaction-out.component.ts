import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { CoinBinance } from 'src/app/common/models/coin-models/coin-binance';
import { TransactionType } from 'src/app/common/models/transaction-models/transaction-type.enum';
import { TransferTransaction } from 'src/app/common/models/transaction-models/transfer-transaction';
import { TransferTransactionOut } from 'src/app/common/models/transaction-models/transfer-transaction-out';
import { SyncfusionUtilsService } from 'src/app/common/syncfusion-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transaction-out',
  templateUrl: './transaction-out.component.html',
  styleUrls: ['./transaction-out.component.css'],
})
export class TransactionOutComponent implements OnInit {
  public data!: DataManager;
  public query!: Query;

  @Output() isSumbitButtonClicked = new EventEmitter<boolean>();

  @Input('dialogType') public dialogType: string = '';
  @Input('coinsBinance') public coinsBinance: CoinBinance[] = [];
  @Input('coinBinance') public coinBinance!: CoinBinance;

  @ViewChild('transactionOutForm') public transactionOutForm!: FormGroup;
  @Input('transactionOut') public transactionOut: TransferTransactionOut = {} as TransferTransactionOut;

  public dateValue: Date = new Date();
  //Dropdown menu for Ticket Statuses
  public fieldsDropDownCoins: Object = {
    text: 'name',
    value: 'symbol',
  };
  constructor(private syncfusionUtilsService: SyncfusionUtilsService) {
    this.data = new DataManager({
      url: environment.urlTransferTransactionOuts,
      adaptor: syncfusionUtilsService.getCustomSecureODataV4AdaptorPatch(),
      crossDomain: true,
    });

    this.query = new Query();
  }

  ngOnInit(): void {
    if (
      this.transactionOut.Date == null &&
      this.transactionOut.Date == undefined
    ) {
      this.transactionOut.Date = this.dateValue;
    }
  }

  //Click on button Sumbit
  onSubmit() {
    //Send updated request from edited residential association form
    var dataUpdate = this.transactionOutForm.value as TransferTransactionOut;

    dataUpdate.Id = this.transactionOut.Id;
    dataUpdate.ApplicationUserId = this.transactionOut.ApplicationUserId;

    if (this.dialogType == 'update') {
      console.log('In Update');
      console.log(dataUpdate);

      this.data.update('Id', dataUpdate);
    }

    if (this.dialogType == 'insert') {
      this.transactionOut.ApplicationUserId = 'x';
      this.transactionOut.Id = -1;
      this.data.insert(this.transactionOut);
    }
    this.isSumbitButtonClicked.emit(true);
    this.transactionOutForm.reset();

    // this.isEdit = false;
    // this.grid.refresh();
  }
}
