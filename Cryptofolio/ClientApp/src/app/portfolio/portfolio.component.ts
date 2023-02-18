import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType, isNullOrUndefined, detach } from '@syncfusion/ej2/base';
import { concatMap, Subscription, timer } from 'rxjs';
import { CoinBinance } from '../common/models/coin-models/coin-binance';
import { BinanceApiService } from '../common/services/binance-api.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  @ViewChild('ddl') ddl!: DropDownList;

  @ViewChild('dialog') dialog!: DialogComponent;
  public form!: FormGroup;

  public header = 'Contact Us';

  public showDialog(): void {
    this.dialog.show();
  }

  public onSubmit(form: NgForm): void {
    console.log(form.value);
    this.dialog.hide();
  }

  public binanceApiSubscription!: Subscription;
  //Dropdown menu for Ticket Statuses
  public fieldsDropDownCoins: Object = {
    text: 'name',
    value: 'symbol',
  };
  public data: CoinBinance[] = [];
  public coinSymbol : string = "";


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


  @ViewChild('template') template!: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef }) container!: ElementRef;
  // The Dialog shows within the target element.
  public targetElement!: HTMLElement;
  public proxy: any = this;

  //To get all element of the dialog component after component get initialized.
  ngOnInit() {
    this.initilaizeTarget();
  }

  // Initialize the Dialog component target element.
  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  }
  public height: string = '250px';
  public dialogOpen: EmitType<object> = () => {
      (document.getElementById('sendButton') as any).keypress = (e: any) => {
          if (e.keyCode === 13) { this.updateTextValue(); }
      };
      (document.getElementById('inVal')as HTMLElement).onkeydown = (e: any) => {
          if (e.keyCode === 13) { this.updateTextValue(); }
      };
      document.getElementById('sendButton')!.onclick = (): void => {
          this.updateTextValue();
      };
  }

  public updateTextValue: EmitType<object> = () => {
      let enteredVal: HTMLInputElement = document.getElementById('inVal') as HTMLInputElement;
      let dialogTextElement: HTMLElement = document.getElementsByClassName('dialogText')[0] as HTMLElement;
      let dialogTextWrap : HTMLElement = document.getElementsByClassName('dialogContent')[0] as HTMLElement;
      if (!isNullOrUndefined(document.getElementsByClassName('contentText')[0])) {
          detach(document.getElementsByClassName('contentText')[0]);
      }
      if (enteredVal.value !== '') {
          dialogTextElement.innerHTML = enteredVal.value;
      }
      enteredVal.value = '';
  }

  // Sample level code to handle the button click action
  public onOpenDialog = (event: any): void => {
      // Call the show method to open the Dialog
      this.template.show();
  }
}

