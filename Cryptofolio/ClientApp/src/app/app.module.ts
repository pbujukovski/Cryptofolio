import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { CryptoDetailsComponent } from './crypto-details/crypto-details.component';
import { CryptoGridComponent } from './crypto-grid/crypto-grid.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { AggregateService, EditService, FilterService, GridModule, GroupService, PageService, ResizeService, SearchService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { LoadingComponent } from './loading/loading.component';
import { CategoryService, ChartModule, DataLabelService, LegendService, LineSeriesService, TooltipService } from '@syncfusion/ej2-angular-charts';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    SidebarMenuComponent,
    CryptoDetailsComponent,
    CryptoGridComponent,
    WatchlistComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    CommonModule,
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    SidebarModule,
    RouterModule,
    AppRoutingModule,
    GridModule,
    ButtonModule,
    ChartModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
      SearchService,
      ToolbarService,
      PageService,
      SortService,
      FilterService,
      GroupService,
      ResizeService,
      EditService,
      AggregateService,
      CategoryService,
      LegendService,
      TooltipService,
      DataLabelService,
      LineSeriesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
