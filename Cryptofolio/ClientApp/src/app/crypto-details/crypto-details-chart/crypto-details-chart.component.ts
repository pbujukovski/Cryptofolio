import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart } from '@syncfusion/ej2-charts';
import { StockChart } from '@syncfusion/ej2-charts';
import * as ej2 from '@syncfusion/ej2-charts';
import { DateTimeService, LegendService, TooltipService, DataLabelService, CandleSeriesService, StockChartComponent, PeriodsModel, StockChartAxisModel, getElement } from '@syncfusion/ej2-angular-charts';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, concatMap, interval, map, Subscription, timer } from 'rxjs';
import { BinanceKlineService } from 'src/app/common/services/binance-kline.service';
import { CoinKlineStream } from 'src/app/common/models/coin-kline-stream';
// import { SplitButton } from '@syncfusion/ej2-splitbuttons';
// import { ButtonGroup } from '@syncfusion/ej2-buttons';
declare var WebSocket: any;
@Component({
  selector: 'app-crypto-details-chart',
  templateUrl: './crypto-details-chart.component.html',
  styleUrls: ['./crypto-details-chart.component.css'],
  providers: [ DateTimeService, LegendService, TooltipService, DataLabelService, CandleSeriesService ]
})
export class CryptoDetailsChartComponent implements OnInit, OnDestroy {

  @Input() public coinSymbol : string = "";
  public data!: Object[];
  public primaryXAxis!: Object;
  public interval: string;
  private refreshSubscription!: Subscription;

  public tooltip!: Object;
  public title!: Object;
  constructor(private stockService: BinanceKlineService) {
    // this.primaryXAxis = { valueType: 'DateTime' };
    this.interval = '1m';
  }

  ngOnInit(): void {
    this.updateData();
    this.refreshSubscription = interval(300000).subscribe(() => {
      this.updateData();
    });

    this.primaryXAxis = {
      valueType: 'DateTime',
      majorGridLines: { width: 0 },
      intervalType: 'Minutes',
      edgeLabelPlacement: 'Shift'
    };
    this.tooltip = { enable: true };
    this.title = { text: 'BTCUSDT Stock Chart' };
  }

  ngOnDestroy(): void {
    this.refreshSubscription.unsubscribe();
  }

  updateInterval(interval: string) {
    this.interval = interval;
    this.updateData();
  }

  updateData() {
    this.stockService.getStockData(this.interval, this.coinSymbol)
      .subscribe((data:any) => {
        this.data = this.processData(data);
      });
  }

  processData(data: any) {
    let processedData = [];
    for (let i = 0; i < data.length; i++) {
      let point = {
        x: new Date(data[i][0]),
        open: data[i][1],
        high: data[i][2],
        low: data[i][3],
        close: data[i][4]
      };
      processedData.push(point);
    }
    return [
      {
        dataSource: processedData,
        xName: 'x',
        yName: 'close',
        type: 'Candle'
      }
    ];
  }
}
