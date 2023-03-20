import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthorizeService } from 'src/api-authorization/authorize.service';

@Component({
  selector: 'app-application-settings',
  templateUrl: './application-settings.component.html',
  styleUrls: ['./application-settings.component.css']
})
export class ApplicationSettingsComponent implements OnInit, OnDestroy {

  constructor(private authorizeService: AuthorizeService) {
    this.authorizeService.isSettingsClicked.next(true);
   }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.authorizeService.isSettingsClicked.next(false);
  }

}
