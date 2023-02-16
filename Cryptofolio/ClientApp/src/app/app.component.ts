import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthorizeService } from 'src/api-authorization/authorize.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';

  public isAuthenticated?: Observable<boolean>;

  constructor(private authorizeService: AuthorizeService){
    this.isAuthenticated = this.authorizeService.isAuthenticated();
  }
}
