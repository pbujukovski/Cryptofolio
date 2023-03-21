import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataManager, Query, ReturnOption } from '@syncfusion/ej2-data';
import { ApplicationUser } from 'src/app/common/models/application-user';
import { SyncfusionUtilsService } from 'src/app/common/syncfusion-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-securty-settings',
  templateUrl: './securty-settings.component.html',
  styleUrls: ['./securty-settings.component.css']
})
export class SecurtySettingsComponent implements OnInit {

  //Odata manager and query
  public data!: DataManager;
  public query!: Query;

  //Booleans
  public dataArrived: boolean = false;
  public isEditEnabled : boolean = false;

  //Decorators
  @ViewChild('applicationUserSecurityForm') public applicationUserSecurityForm!: FormGroup;

  //Data
  public passwordConfirm : string = '';
  public applicationUser!: ApplicationUser;

  constructor(private syncfusionUtilsService : SyncfusionUtilsService, private router: Router) {
    this.data = new DataManager({
      url: environment.urlApplicationUser,
      adaptor: syncfusionUtilsService.getCustomSecureODataV4Adaptor(),
      crossDomain: true,
    });

    this.query = new Query();
  }

  ngOnInit(): void {
    this.getAppUserDetails();
  }

  //Send request to get data for current user
  public getAppUserDetails() {
    this.data
      .executeQuery(this.query)
      .then((e: ReturnOption) => {
        var resultList = e.result as ApplicationUser[];
        this.dataArrived = true;
        if (resultList != null) {
          this.applicationUser = resultList[0];
        } else console.log('Result list is empty');
      })
      .catch((e) => true);
  }

   //Send updated data for current user
  public onSubmit(){
    console.log("HERE ON UPDATE");
    var waitPromise = this.data.update("Id",this.applicationUser) as Promise<any>;

    //Wait updated data for current user
    waitPromise.then((value: any) => {
      this.applicationUserSecurityForm.reset();
     this.isEditEnabled == false;
    });
  }

  public onBack(){
    this.router.navigate(['home']);
  }

  public onEditClicked(){
    this.isEditEnabled = true;
  }

  public onCancelClicked(){
    this.applicationUserSecurityForm.reset();
    this.isEditEnabled = false;
  }
}
