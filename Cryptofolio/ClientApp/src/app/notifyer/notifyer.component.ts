import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { DialogComponent, DialogUtility } from '@syncfusion/ej2-angular-popups';
import { DataManager, Query, ReturnOption } from '@syncfusion/ej2-data';
import { EmitType } from '@syncfusion/ej2/base';
import { BehaviorSubject, Subscription, switchMap, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CoinBinance } from '../common/models/coin-models/coin-binance';
import { Notifier } from '../common/models/notifier.model';
import { BinanceApiService } from '../common/services/binance-api.service';
import { SyncfusionUtilsService } from '../common/syncfusion-utils';

@Component({
  selector: 'app-notifyer',
  templateUrl: './notifyer.component.html',
  styleUrls: ['./notifyer.component.css'],
})
export class NotifyerComponent implements OnInit {
  //Html target element
  public targetElement!: HTMLElement;

  //Odata manager and query
  public data!: DataManager;
  public query!: Query;

  //booleans
  public isNewSubscriptionBtnClicked: boolean = false;
  public isDeleteContentClicked: boolean = false;
  public isDataArrived : boolean = false;
  //Notifier Data
  public notifier: Notifier = {} as Notifier;
  public notifiers: Notifier[] = [];
  public inactiveNotifiers: Notifier[] = [];
  public deleteNotifierFromList: Notifier = {} as Notifier;
  public indexNotifier: number = -1;

  //Get current date
  public dateValue: Date = new Date();

  //Set default interval
  public interval: string = 'Bearish';

  //Behavior Subject
  public notifierUpdate: BehaviorSubject<Notifier> =
    new BehaviorSubject<Notifier>(new Notifier());

  //Decorators
  @ViewChild('ddl') ddl!: DropDownList;
  @ViewChild('notifierForm') public notifierForm!: FormGroup;
  @ViewChild('dialog') dialog!: DialogComponent;

  //Subscriptions
  public binanceApiSubscription!: Subscription;

  //Dropdown menu for Ticket Statuses
  public fieldsDropDownCoins: Object = {
    text: 'name',
    value: 'symbol',
  };
  public coinBinance: CoinBinance[] = [];
  public coinSymbol: string = '';

  getButtonClass(interval: string) {
    console.log(interval);
    return this.interval === interval ? 'selected' : '';
  }
  constructor(
    private binanceApiService: BinanceApiService,
    private syncfusionUtilsService: SyncfusionUtilsService
  ) {
    this.data = new DataManager({
      url: environment.urlNotifiers,
      adaptor: syncfusionUtilsService.getCustomSecureODataV4Adaptor(),
      crossDomain: true,
    });

    this.query = new Query();

    const binanceApiObsearvable$ = timer(1000, 3000000);

    // //Subscribe to get coins updated from Binance Service
    // this.binanceApiSubscription = this.binanceApiService.CoinsUpdated.subscribe(
    //   (coinBinance) => {
    //     //Set data to data from binance service
    //     this.coinBinance = coinBinance;
    //   }
    // );


    // this.binanceApiSubscription = this.binanceApiService.getCoins().subscribe();
    this.getNotifiers();
    this.binanceApiSubscription = binanceApiObsearvable$
    .pipe(
      switchMap(() => this.binanceApiService.getCoins()),
      switchMap((coinsBinance) => {
        this.coinBinance = coinsBinance;

        this.isDataArrived = true;
        return this.binanceApiService.CoinsUpdated;
      })
    )
    .subscribe(() => {
    });
  }

  public getNotifiers() {
    this.data
      .executeQuery(this.query)
      .then((e: ReturnOption) => {
        var resultList = e.result as Notifier[];
        if (resultList != null) {
          resultList.forEach((result) => {
            if (result.DueDate! > this.dateValue) {
              this.notifiers.push(result);
            } else if (result.DueDate! < this.dateValue) {
              this.inactiveNotifiers.push(result);
            }
          }
          );
          this.isDataArrived = true;
        } else console.log('Result list is empty');
      })
      .catch((e) => true);

    console.log(this.notifiers);
  }

  ngOnInit(): void {}

  onAddNewNotifierSubscripiton() {
    this.isNewSubscriptionBtnClicked = true;
    this.dialog.show();
  }
  //Click on button Sumbit
  onSubmit() {
    //Send updated request from edited residential association form
    console.log('this.notifier');
    console.log(this.notifier);
    console.log(this.notifier.DesiredPrice);
    this.notifier.ApplicationUserId = 'x';
    this.notifier.Id = -1;
    var temp = this.data.insert(this.notifier) as Promise<Notifier>; //Waiting response from backend to be sure that new notifaer comes with ID.
    temp.then((value: Notifier) => {
      if (this.coinSymbol != null) {
        this.notifiers.unshift(value); //Adding notifier to list after the response from the promise
      }
    });

    this.isNewSubscriptionBtnClicked = false;
    this.notifierForm.reset();
  }

  onUpdatePriceVariation(interval: boolean) {
    this.notifier.isHigher = interval;
    if (interval == true) {
      this.interval = 'Bullish';
    } else {
      this.interval = 'Bearish';
    }
  }

  onDelete(eventDataNotifier: Notifier, i: number) {
    this.isDeleteContentClicked = true;
    this.deleteNotifierFromList = eventDataNotifier;
    this.indexNotifier = i;
  }

  //Hide dialog component if on side is clicked
  public onOverlayClick: EmitType<object> = () => {
    this.isNewSubscriptionBtnClicked = false;
    this.dialog.hide();
    this.notifierForm.reset();
  };

  public onClose() {
    this.isDeleteContentClicked = false;
    this.dialog!.hide();
  }

  public deleteSelectedContent() {
    this.data.remove('Id', this.deleteNotifierFromList);
    if (this.deleteNotifierFromList.DueDate! < this.dateValue) {
      this.inactiveNotifiers.splice(this.indexNotifier, 1);
    } else {
      this.notifiers.splice(this.indexNotifier, 1);
    }
    this.isDeleteContentClicked = false;
  }


}
