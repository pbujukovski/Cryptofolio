import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { CoinBinance } from 'src/app/common/models/coin-models/coin-binance';
import { FinanceTransactionSell } from 'src/app/common/models/transaction-models/finance-transaction-sell';
import { SyncfusionUtilsService } from 'src/app/common/syncfusion-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transaction-sell',
  templateUrl: './transaction-sell.component.html',
  styleUrls: ['./transaction-sell.component.css']
})
export class TransactionSellComponent implements OnInit {

    public data!: DataManager;
    public query!: Query;

    @Input("coinsBinance")  public coinsBinance: CoinBinance[] = [];
    @ViewChild('transactionSellForm') public transactionSellForm!: FormGroup;
    public transactionSell: FinanceTransactionSell = {} as FinanceTransactionSell;

    public dateValue: Date =  new Date();
    //Dropdown menu for Ticket Statuses
    public fieldsDropDownCoins: Object = {
      text: 'name',
      value: 'symbol',
    };
  constructor(private syncfusionUtilsService: SyncfusionUtilsService) {
    this.data = new DataManager({
      url: environment.urlFinanceTransactionSells,
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
      console.log(this.transactionSell);

      this.transactionSell.ApplicationUserId = 'x';
      this.transactionSell.Id = -1;
      this.data.insert(this.transactionSell);
      this.transactionSellForm.reset();
      // this.isEdit = false;
      // this.grid.refresh();
    }
}
