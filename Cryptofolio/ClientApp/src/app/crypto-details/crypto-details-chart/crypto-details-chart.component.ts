import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart } from '@syncfusion/ej2-charts';
import { StockChart } from '@syncfusion/ej2-charts';
import * as ej2 from '@syncfusion/ej2-charts';
import { DateTimeService, LegendService, TooltipService, DataLabelService, CandleSeriesService, ZoomSettingsModel} from '@syncfusion/ej2-angular-charts';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, concatMap, interval, map, Subscription, timer } from 'rxjs';
import { BinanceKlineService } from 'src/app/common/services/binance-kline.service';
import { CoinKlineStream } from 'src/app/common/models/coin-models/coin-kline-stream';
import { Button } from '@syncfusion/ej2-angular-buttons';
// import { SplitButton } from '@syncfusion/ej2-splitbuttons';
// import { ButtonGroup } from '@syncfusion/ej2-buttons';
declare var WebSocket: any;
@Component({
  selector: 'app-crypto-details-chart',
  templateUrl: './crypto-details-chart.component.html',
  styleUrls: ['./crypto-details-chart.component.css'],
  providers: [ DateTimeService, LegendService, TooltipService, DataLabelService, CandleSeriesService ]
})
export class CryptoDetailsChartComponent implements OnInit {


  public selectedIndex: number = 0;

  @Input('coinSymbol') public coinSymbol : string = '';
  constructor(private http: HttpClient, private stockService: BinanceKlineService){
    this.interval = '1d';
  }
  public interval: string;
  candleData: any;
  primaryXAxis!: Object;
  primaryYAxis!: Object;
  rows!: string[];
  columns!: string[];

  public zoomSettings!: ZoomSettingsModel;
  public crosshair!: Object;
  public tooltip!: Object;
  private refreshSubscription!: Subscription;

  getButtonClass(interval  : string) {
    return this.interval === interval ? 'selected' : '';
  }

  ngOnInit() {
    this.getCandleData();
    this.refreshSubscription = interval(300000).subscribe(() => {
      this.getCandleData();
    });

    this.primaryXAxis = {
      valueType: 'DateTime'
    };

    this.primaryYAxis = {
      title: 'Price'
    };

    this.crosshair= {
      enable: true
  };
    this.rows = ['Close'];
    this.columns = ['x', 'close'];

    this.tooltip = {
      enable: true
    };

    this.zoomSettings = {
      enableMouseWheelZooming: true,
      enablePinchZooming: false, // disable pinch zooming to enable scroll zooming
      enableSelectionZooming: false // disable selection zooming to enable scroll zooming
    };
  }

  updateInterval(interval: string) {
    this.interval = interval;
    this.getCandleData();
  }

  getCandleData() {
    this.stockService.getStockData(this.interval, this.coinSymbol)
      .subscribe((data:any) => {
        this.candleData = [];
        data.forEach((candleData: any[]) => {
          this.candleData.push({
            x: new Date(candleData[0]),
            open: candleData[1],
            high: candleData[2],
            low: candleData[3],
            close: candleData[4],
          });
        });
      });
  }

}
