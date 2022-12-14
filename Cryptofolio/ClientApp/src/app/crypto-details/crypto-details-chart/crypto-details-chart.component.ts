import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, getElement, ILoadedEventArgs } from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-crypto-details-chart',
  templateUrl: './crypto-details-chart.component.html',
  styleUrls: ['./crypto-details-chart.component.css']
})
export class CryptoDetailsChartComponent implements OnInit {

  public binanceWebSocket !: WebSocket;

  public data: any;




  // constructor() { }

  // ngOnInit(): void {
  //   console.log("HEREE ON CHART");
  //   this.binanceWebSocket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_1m");

  //   this.binanceWebSocket.onmessage = (event) => {

  //     var data = JSON.parse(event.data);
  //     this.data =data;
  //     console.log(this.data);

  //   }
  //   this.primaryXAxis = {
  //     interval: 1, valueType: 'Category'
  // };
  // // this.primaryYAxis =
  // // {
  // //     title: 'Expense',
  // //     interval: 100,
  // //     labelFormat: '${value}',
  // // },
  //   this.marker = { visible: true };
  // }
  public series1: Object[] = [];
    public value: number = 10;
    public intervalId: any;
    public setTimeoutValue!: number;
    public i: number = 0;
    //Initializing Primary Y Axis
    public primaryYAxis: Object = {
        minimum:0,
        maximum: 50
    };
    @ViewChild('chart')
    public chart!: ChartComponent;

    public marker: Object = {
        visible: true
    };
    public animation1: Object = {
        enable: false
    };
    public loaded(args: ILoadedEventArgs): void {
        this.setTimeoutValue = 100;
        this.intervalId = setInterval(
            () => {
                let i: number;
                if (getElement('chart-container') === null) {
                    clearInterval(this.intervalId);
                } else {
                    if (Math.random() > .5) {
                        if (this.value < 25) {
                            this.value += Math.random() * 2.0;
                        } else {
                            this.value -= 2.0;
                        }
                    }
                    this.i++;
                    this.series1.push({ x: this.i, y: this.value });
                    this.series1.shift();
                    args.chart.series[0].dataSource = this.series1;

                    args.chart.refresh();
                }
            },
            this.setTimeoutValue);
    }
    constructor() {
        for (; this.i < 100; this.i++) {
            if (Math.random() > .5) {
                if (this.value < 25) {
                    this.value += Math.random() * 2.0;
                } else {
                    this.value -= 2.0;
                }
            }
            this.series1[this.i] = { x: this.i, y: this.value };

        }

    }

    ngOnInit(): void {

  }


}
