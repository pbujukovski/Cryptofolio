import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { map, Observable } from 'rxjs';
import { AuthorizeService } from 'src/api-authorization/authorize.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {

  public isExpanded : boolean = false;
  public isAuthenticated?: Observable<boolean>;
  public userName?: Observable<string | null | undefined>;

  @ViewChild('sidebarMenu') sidebarMenu!: SidebarComponent;
  public type: string = 'Push';
  public target: string = '#app-container';
  public width: string = '200px';
  public dockSize: string = '60px';
  public enableDock: boolean = true;


  constructor(private authorizeService: AuthorizeService) { }

  ngOnInit() {
    this.isAuthenticated = this.authorizeService.isAuthenticated();
    this.userName = this.authorizeService.getUser().pipe(map(u => u && u.name));
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  // SF Sidebar
  public onSidebarCreated(args: any) {
    this.sidebarMenu.element.style.visibility = '';
    this.onSidebarToggle();
  }

  public onSidebarToggle() {
    this.sidebarMenu.toggle();
  }
}
