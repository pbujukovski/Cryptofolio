import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WStyles } from '@syncfusion/ej2/documenteditor';
import { cryptoSymbol } from 'crypto-symbol';
import { BehaviorSubject } from 'rxjs';
import { CoinBinance } from '../common/models/coin-binance';
import { CoinSocket } from '../common/models/coin-socket';
import { BinanceApiService } from '../common/services/binance-api.service';


const { nameLookup } = cryptoSymbol({});

@Component({
  selector: 'app-crypto-details',
  templateUrl: './crypto-details.component.html',
  styleUrls: ['./crypto-details.component.css']
})
export class CryptoDetailsComponent implements OnInit, OnDestroy {

  // @Input('selectedSymbol') public modelData!: string;

  public coinSymbol : string = "";
  // @Input('selectedSymbol') set selectedSymbolParam (value: string ){
  //   console.log(' set selectedSymbolParam');
  //   console.log(value);
  //    this.somestring = value;

  // }

  public lastPrice : number = -1;
  public dollarCurr: Intl.NumberFormat = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'});


    @ViewChild('myDiv') myDiv!: ElementRef;
  public binanceWebSocket : WebSocket;

  public binanceWebSocket24 : WebSocket;
  public coin!: CoinSocket;
  constructor(private binanceApiService: BinanceApiService,  public router: Router ) {


    this.binanceApiService.coinSymbol.subscribe(coinSymbol => this.coinSymbol = coinSymbol);
    console.log(this.coinSymbol);
    if (this.coinSymbol === ''){
      this.router.navigate(['cryptos']);
    }
    this.coinSymbol.toLocaleLowerCase()


    this.binanceWebSocket = new WebSocket("wss://stream.binance.com:9443/ws/" + this.coinSymbol.toLowerCase() + "usdt@trade");


    this.binanceWebSocket24 = new WebSocket("wss://stream.binance.com:9443/ws/" + this.coinSymbol.toLowerCase() + "usdt@ticker");
    let checkUrl = ("wss://stream.binance.com:9443/ws/usdt@trade")



    this.binanceWebSocket.onmessage = (event) => {
      this.coin = JSON.parse(event.data);
      const splitName = this.coin.s.split('USDT').find((x) => x !== 'USDT') ?? '';
      this.coin.iconPath = './assets/icon/' + `${splitName.toLowerCase()}` + '.png';
      this.coin.p = this.dollarCurr.format(parseFloat(this.coin.p));
      this.coin.name = nameLookup(splitName) ?? splitName;
      this.coin.s = splitName;

      var coinPrice = Number(this.coin.p.replace(/[^0-9.-]+/g,""));

      this.myDiv.nativeElement.style.color = !this.lastPrice || this.lastPrice === coinPrice ? 'black' : coinPrice > this.lastPrice ? 'green' : 'red';

      this.lastPrice = coinPrice;
    }


    this.binanceWebSocket24.onmessage = (event) => {
    }
  }

  ngOnInit(): void {



  }

  ngOnDestroy(): void{
    this.binanceWebSocket.close();
  }

  onCancel(): void {
    this.router.navigate(['cryptos']);
  }

}
