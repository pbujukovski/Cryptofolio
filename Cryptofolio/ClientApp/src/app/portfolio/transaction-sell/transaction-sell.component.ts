import { HttpClient } from '@angular/common/http';
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
import { FinanceTransactionSell } from 'src/app/common/models/transaction-models/finance-transaction-sell';
import { SyncfusionUtilsService } from 'src/app/common/syncfusion-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transaction-sell',
  templateUrl: './transaction-sell.component.html',
  styleUrls: ['./transaction-sell.component.css'],
})
export class TransactionSellComponent implements OnInit {
  public data!: DataManager;
  public query!: Query;

  @Output() isSumbitButtonClicked = new EventEmitter<boolean>();

  @Input('dialogType') public dialogType: string = '';
  @Input('coinsBinance') public coinsBinance: CoinBinance[] = [];
  @Input('coinBinance') public coinBinance!: CoinBinance;
  @Input('transactionSell') public transactionSell: FinanceTransactionSell =
    {} as FinanceTransactionSell;

  @ViewChild('transactionSellForm') public transactionSellForm!: FormGroup;

  public dateValue: Date = new Date();

  //Dropdown menu for Ticket Statuses
  public fieldsDropDownCoins: Object = {
    text: 'name',
    value: 'symbol',
  };
  constructor(
    private syncfusionUtilsService: SyncfusionUtilsService,
    public http: HttpClient
  ) {
    this.data = new DataManager({
      url: environment.urlFinanceTransactionSells,
      adaptor: syncfusionUtilsService.getCustomSecureODataV4AdaptorPatch(),
      crossDomain: true,
    });

    this.query = new Query();
  }

  ngOnInit(): void {
    if (
      this.transactionSell.Date == null &&
      this.transactionSell.Date == undefined
    ) {
      this.transactionSell.Date = this.dateValue;
    }
  }

  //Click on button Sumbit
  onSubmit() {
    //Send updated request from edited residential association form
    var dataUpdate = this.transactionSellForm.value as FinanceTransactionSell;

    dataUpdate.Id = this.transactionSell.Id;
    dataUpdate.ApplicationUserId = this.transactionSell.ApplicationUserId;

    if (this.dialogType == 'update') {
      console.log('In Update');
      console.log(dataUpdate);
      this.data.update('Id', dataUpdate);
    }

    if (this.dialogType == 'insert') {
      this.transactionSell.ApplicationUserId = 'x';
      this.transactionSell.Id = -1;
      this.data.insert(this.transactionSell);
    }
    this.isSumbitButtonClicked.emit(true);
    this.transactionSellForm.reset();

    // this.isEdit = false;
    // this.grid.refresh();
  }

  calculateTotalSpend(): number {
    let amount = this.transactionSell.Amount ?? 0;
    let fee = this.transactionSell.Fee ?? 0;
    let price = this.transactionSell.Price ?? 0;
    this.transactionSell.Amount * this.transactionSell.Price +
      this.transactionSell.Fee;
    let sum: number = amount * price;
    sum = Math.round(sum * 100) / 100;
    fee = Math.round(fee * 100) / 100;
    return sum + fee;
  }

  public coinSymbolChanged: string = '';
  public articles: any[] = [];
  // lastPriceFetchDate: Date | null = null;
  // dataPrice: Object = new Object();
  // public Date = document.getElementById('Date') as HTMLInputElement;

  public getPriceFromDate(obj: any) {
    const endTime = this.transactionSell.Date.getTime();
    const date = new Date(endTime);
    date.setMinutes(date.getMinutes() - 1);
    const startTime = date.getTime();

    let testSymbol;
    if (obj.itemData?.symbol) {
      testSymbol = obj.itemData.symbol ?? '';
      this.coinSymbolChanged = testSymbol;
    }

    if (obj.itemData == undefined && this.dialogType == 'insert') {
      testSymbol = this.coinSymbolChanged;
    }
    if (this.dialogType == 'update') {
      testSymbol = this.transactionSell.CoinSymbol;
    }

    if (testSymbol != undefined) {
      const url = `https://api.binance.com/api/v3/klines?symbol=${testSymbol}USDT&interval=1m&startTime=${startTime}&endTime=${endTime}`;
      const data = this.http.get(url).subscribe((data: any) => {
        this.articles = data;

        this.transactionSell.Price = data != undefined ? data[0][4] : 0;
        this.transactionSell.Price =
          Math.round(this.transactionSell.Price * 100) / 100;
      });
    }
  }
}
