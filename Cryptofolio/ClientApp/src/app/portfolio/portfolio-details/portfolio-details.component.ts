import { Component, OnInit, ViewChild } from '@angular/core';
import { Dialog, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2/base';

@Component({
  selector: 'app-portfolio-details',
  templateUrl: './portfolio-details.component.html',
  styleUrls: ['./portfolio-details.component.css']
})
export class PortfolioDetailsComponent implements OnInit {

  public transactionTypes: string[] = ['Buy', 'Sell'];
  public selectedTransactionType: string = 'Buy';
  public dialog!: Dialog;

  ngOnInit() {
    const dialogTarget = document.getElementById('addTransactionDialog');
    if (dialogTarget) {
      this.dialog = new Dialog({
        header: 'Add Transaction',
        visible: false,
        showCloseIcon: true,
        closeOnEscape: true,
        target: dialogTarget
      });
    }
  }

   public openDialog() {
    this.dialog.show();
  }

  public closeDialog() {
    this.dialog.hide();
  }


}
  // @ViewChild('ejDialog') ejDialog!: DialogComponent;

  // public isAddNewClicked : boolean = false;
  //   // The Dialog shows within the target element.
  //   public targetElement!: HTMLElement;
  // constructor() { }

  // ngOnInit(): void {
  // }


  //   // Sample level code to handle the button click action
  //   public onOpenDialog = (event: any): void => {
  //     // Call the show method to open the Dialog
  //     this.ejDialog.show();

  // };
  // // Sample level code to hide the Dialog when click the Dialog overlay
  // public onOverlayClick: EmitType<object> = () => {
  //     this.ejDialog.hide();
  // }

