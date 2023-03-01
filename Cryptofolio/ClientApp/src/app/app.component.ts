import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizeService } from 'src/api-authorization/authorize.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  public isNavigating : boolean = false;
  public isAuthenticated?: Observable<boolean>;

  constructor(private authorizeService: AuthorizeService,private router: Router){
    this.isAuthenticated = this.authorizeService.isAuthenticated();


    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating = true;
      }
    });
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel) {
        this.isNavigating = false;
      }
    });


  }
}
