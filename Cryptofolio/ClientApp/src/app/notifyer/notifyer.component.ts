import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { DialogComponent, DialogUtility } from '@syncfusion/ej2-angular-popups';
import { DataManager, Query, ReturnOption } from '@syncfusion/ej2-data';
import { EmitType } from '@syncfusion/ej2/base';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CoinBinance } from '../common/models/coin-models/coin-binance';
import { Notifier } from '../common/models/notifier.model';
import { BinanceApiService } from '../common/services/binance-api.service';
import { SyncfusionUtilsService } from '../common/syncfusion-utils';

@Component({
  selector: 'app-notifyer',
  templateUrl: './notifyer.component.html',
  styleUrls: ['./notifyer.component.css']
})
export class NotifyerComponent implements OnInit {
  public targetElement!: HTMLElement;
  public data!: DataManager;
  public query!: Query;
  public notifier: Notifier = {} as Notifier;
  public notifiers: Notifier[] = [];

  public isNewSubscriptionBtnClicked: boolean = false;
  public notifierUpdate: BehaviorSubject<Notifier> = new BehaviorSubject<Notifier>(new Notifier());
  @ViewChild('ddl') ddl!: DropDownList;
  @ViewChild('notifierForm') public notifierForm!: FormGroup;
  public dateValue: Date =  new Date();

  @ViewChild("dialog") dialog!: DialogComponent;

  public interval : string = 'Bearish';
  public binanceApiSubscription!: Subscription;
  //Dropdown menu for Ticket Statuses
  public fieldsDropDownCoins: Object = {
    text: 'name',
    value: 'symbol',
  };
  public coinBinance: CoinBinance[] = [];
  public coinSymbol : string = "";


  getButtonClass(interval  : string) {
    console.log(interval);
    return this.interval === interval ? 'selected' : '';
  }
  constructor(private binanceApiService: BinanceApiService, private syncfusionUtilsService: SyncfusionUtilsService) {
    this.data = new DataManager({
      url: environment.urlNotifiers,
      adaptor:  syncfusionUtilsService.getCustomSecureODataV4Adaptor(),
      crossDomain: true,
    });

     this.query = new Query();

     const binanceApiObsearvable$ = timer(1000, 30000);

     //Subscribe to get coins updated from Binance Service
     this.binanceApiSubscription = this.binanceApiService.CoinsUpdated.subscribe(
       (coinBinance) => {
         //Set data to data from binance service
         this.coinBinance = coinBinance;
       }
     );


    this.getNotifiers();
     this.binanceApiSubscription = this.binanceApiService.getCoins().subscribe();
   }

   public getNotifiers(){
    this.data
    .executeQuery(this.query)
    .then((e: ReturnOption) => {
      var resultList = e.result as Notifier[];
      if (resultList != null ) {
        this.notifiers = resultList;
        // this.notifierUpdate.next(this.notifier);
      } else console.log('Result list is empty');
    })
    .catch((e) => true);

    console.log(this.notifiers);
  }

  ngOnInit(): void {
  }


    //Click on button Cancel
    onCancel() {
      // this.isEdit = false;
    }

    onAddNewNotifierSubscripiton(){
      this.isNewSubscriptionBtnClicked = true;
      this.dialog.show();
    }
    //Click on button Sumbit
    onSubmit() {
      //Send updated request from edited residential association form
      console.log("this.notifier");
      console.log(this.notifier);
      console.log(this.notifier.DesiredPrice);
      this.notifier.ApplicationUserId = 'x';
      this.notifier.Id = -1;
      this.data.insert(this.notifier);
      this.isNewSubscriptionBtnClicked = false;
      this.notifierForm.reset();
      // this.isEdit = false;
      // this.grid.refresh();
    }

    onUpdatePriceVariation(interval : boolean){
      this.notifier.isHigher = interval;
      // this.interval =
    }

    onDelete(eventDataNotifier : Notifier, i : number){
      console.log("data in delete");
      console.log(eventDataNotifier);
       this.data.remove("Id", eventDataNotifier);
       this.notifiers.slice(i,1);
    }

    //Hide dialog component if on side is clicked
    public onOverlayClick: EmitType<object> = () => {
      this.isNewSubscriptionBtnClicked = false;
      this.dialog.hide();
      this.notifierForm.reset();
    }

  //   public onOpenDialog = function(): void {
  //     DialogUtility.confirm('Are you sure you want to delete this subscription?');
  // }


}
