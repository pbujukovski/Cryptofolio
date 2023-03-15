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
import { convertStringToValue } from '@syncfusion/ej2/maps';
import { firstValueFrom } from 'rxjs';
import { CoinBinance } from 'src/app/common/models/coin-models/coin-binance';
import { CoinKlineStream } from 'src/app/common/models/coin-models/coin-kline-stream';
import { FinanceTransactionBuy } from 'src/app/common/models/transaction-models/finance-transaction-buy';
import { BinanceKlineService } from 'src/app/common/services/binance-kline.service';
import { SyncfusionUtilsService } from 'src/app/common/syncfusion-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transaction-buy',
  templateUrl: './transaction-buy.component.html',
  styleUrls: ['./transaction-buy.component.css'],
})
export class TransactionBuyComponent implements OnInit {

  @Output() isSumbitButtonClicked = new EventEmitter<boolean>();

  @Input('dialogType') public dialogType: string = '';
  @Input('coinsBinance') public coinsBinance: CoinBinance[] = [];
  @Input('coinBinance') public coinBinance!: CoinBinance;
  @Input('transactionBuy') public transactionBuy: FinanceTransactionBuy = {} as FinanceTransactionBuy;

  @ViewChild('transactionBuyForm') public transactionBuyForm!: FormGroup;

  public data!: DataManager;
  public query!: Query;
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
      url: environment.urlFinanceTransactionBuys,
      adaptor: syncfusionUtilsService.getCustomSecureODataV4AdaptorPatch(),
      crossDomain: true,
    });

    this.query = new Query();
  }

  ngOnInit(): void {
    if (
      this.transactionBuy.Date == null &&
      this.transactionBuy.Date == undefined
    ) {
      this.transactionBuy.Date = this.dateValue;
    }
  }

  //Click on button Sumbit
  onSubmit() {
    //Send updated request from edited residential association form
    var dataUpdate = this.transactionBuyForm.value as FinanceTransactionBuy;

    dataUpdate.Id = this.transactionBuy.Id;
    dataUpdate.ApplicationUserId = this.transactionBuy.ApplicationUserId;

    if (this.dialogType == 'update') {
      console.log('In Update');
      console.log(dataUpdate);
      this.data.update('Id', dataUpdate);
    }

    if (this.dialogType == 'insert') {
      this.transactionBuy.ApplicationUserId = 'x';
      this.transactionBuy.Id = -1;
      this.data.insert(this.transactionBuy);
    }
    this.isSumbitButtonClicked.emit(true);
    this.transactionBuyForm.reset();
    // this.isEdit = false;
    // this.grid.refresh();
  }

  calculateTotalSpend(): number {
    let amount = this.transactionBuy.Amount ?? 0;
    let fee = this.transactionBuy.Fee ?? 0;
    let price = this.transactionBuy.Price ?? 0;
    this.transactionBuy.Amount * this.transactionBuy.Price + this.transactionBuy.Fee
    let sum : number = amount * price;
    sum =
    Math.round(sum * 100) / 100;
    fee = Math.round(fee * 100) / 100;
    return sum+fee;
  }

  public coinSymbolChanged: string = '';
  public articles: any[] = [];
  // lastPriceFetchDate: Date | null = null;
  // dataPrice: Object = new Object();
  // public Date = document.getElementById('Date') as HTMLInputElement;

  public getPriceFromDate(obj: any) {
    const endTime = this.transactionBuy.Date.getTime();
    const date = new Date(endTime);
    date.setMinutes(date.getMinutes() - 1);
    const startTime = date.getTime();

    let testSymbol;
    if (obj.itemData?.symbol ) {
      testSymbol = obj.itemData.symbol ?? '';
      this.coinSymbolChanged = testSymbol;
    }

    if (obj.itemData == undefined && this.dialogType == 'insert') {
      testSymbol = this.coinSymbolChanged;
    }
    if (this.dialogType == 'update'){
      testSymbol = this.transactionBuy.CoinSymbol;
    }

    if (testSymbol != undefined) {
      const url = `https://api.binance.com/api/v3/klines?symbol=${testSymbol}USDT&interval=1m&startTime=${startTime}&endTime=${endTime}`;
      const data = this.http.get(url).subscribe((data: any) => {
        this.articles = data;

        this.transactionBuy.Price = data != undefined ? data[0][4] : 0;
        this.transactionBuy.Price =
          Math.round(this.transactionBuy.Price * 100) / 100;
      });
    }
  }
}
