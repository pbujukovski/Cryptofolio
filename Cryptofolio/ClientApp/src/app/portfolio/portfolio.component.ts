import { Component, OnInit, ViewChild } from '@angular/core';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { concatMap, Subscription, timer } from 'rxjs';
import { CoinBinance } from '../common/models/coin-binance';
import { BinanceApiService } from '../common/services/binance-api.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  @ViewChild('ddl') ddl!: DropDownList;

  public binanceApiSubscription!: Subscription;
  //Dropdown menu for Ticket Statuses
  public fieldsDropDownCoins: Object = {
    text: 'name',
    value: 'symbol',
  };
  public data: CoinBinance[] = [];
  public coinSymbol : string = "";



  public placeholder: string = 'Select a game';
  public fields: object = { text: 'Game', value: 'Value' };
  public value: string = 'chess';
  public gamesData: object[] = [
    { text: 'Chess', Value: 'chess' },
    { Game: 'Carrom', Value: 'carrom' },
    { Game: 'Ludo', Value: 'ludo' },
  ];

  onChange(args :any) {
    console.log(args.value);
  }

  constructor(private binanceApiService: BinanceApiService) {

    const binanceApiObsearvable$ = timer(1000, 10000);

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
  }


}
