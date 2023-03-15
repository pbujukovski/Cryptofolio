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
import { AggregateService, EditService, FilterService, GridAllModule, GridModule, GroupService, PagerAllModule, PageService, ResizeService, SearchService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ButtonAllModule, ButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { LoadingComponent } from './loading/loading.component';
import { CandleSeriesService, CategoryService, ChartModule, ColumnSeriesService, DataLabelService, DateTimeService, LegendService, LineSeriesService, MultiColoredLineSeriesService, ParetoSeriesService, SplineAreaSeriesService, SplineSeriesService, StackingLineSeriesService, StepLineSeriesService, StockChart, StockChartAllModule, TooltipService } from '@syncfusion/ej2-angular-charts';
import { CryptoDetailsChartComponent } from './crypto-details/crypto-details-chart/crypto-details-chart.component';
import { RichTextEditorAllModule, RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { CommentSectionComponent } from './crypto-details/comment-section/comment-section.component';
import { ComboBoxModule, DropDownListAllModule, DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PortfolioDetailsComponent } from './portfolio/portfolio-details/portfolio-details.component';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ZoomService } from '@syncfusion/ej2-angular-charts';
import { AbbreviateNumberPipe } from './common/pipes/abbreviate-number.pipe';
import { RemoveChar } from './common/pipes/remove-char.pipe';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NotifyerComponent } from './notifyer/notifyer.component';
import { TransactionSellComponent } from './portfolio/transaction-sell/transaction-sell.component';
import { TransactionBuyComponent } from './portfolio/transaction-buy/transaction-buy.component';
import { TransactionInComponent } from './portfolio/transaction-in/transaction-in.component';
import { TransactionOutComponent } from './portfolio/transaction-out/transaction-out.component';
import { TransactionDetailsComponent } from './portfolio/transaction-details/transaction-details.component';
import { AbbreviateOrNumberPipe } from './common/pipes/abbreviate-or-number.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    SidebarMenuComponent,
    CryptoDetailsComponent,
    CryptoGridComponent,
    WatchlistComponent,
    LoadingComponent,
    CryptoDetailsChartComponent,
    CommentSectionComponent,
    PortfolioComponent,
    PortfolioDetailsComponent,
    AbbreviateNumberPipe,
    AbbreviateOrNumberPipe,
    RemoveChar,
    NotifyerComponent,
    TransactionSellComponent,
    TransactionBuyComponent,
    TransactionInComponent,
    TransactionOutComponent,
    TransactionDetailsComponent
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
    GridAllModule,
    ButtonModule,
    ChartModule,
    StockChartAllModule,
    RichTextEditorAllModule,
    PagerAllModule,
    CheckBoxModule,
    DropDownListAllModule,
    DialogModule,
    TextBoxModule,
    ComboBoxModule,
    DateTimePickerModule

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
    LineSeriesService,
    StepLineSeriesService,
    SplineSeriesService,
    StackingLineSeriesService,
    DateTimeService,
    SplineAreaSeriesService,
    MultiColoredLineSeriesService,
    ParetoSeriesService,
    ColumnSeriesService,
    CandleSeriesService,
    ZoomService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
