import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { CategoryService, LegendService, TooltipService, DataLabelService, LineSeriesService, StepLineSeriesService, SplineSeriesService, StackingLineSeriesService, DateTimeService, SplineAreaSeriesService, MultiColoredLineSeriesService, ParetoSeriesService, ColumnSeriesService, CandleSeriesService, ZoomService } from "@syncfusion/ej2-angular-charts";
import { SearchService, ToolbarService, PageService, SortService, FilterService, GroupService, ResizeService, EditService, AggregateService } from "@syncfusion/ej2-angular-grids";
import { SidebarModule } from "@syncfusion/ej2-angular-navigations";
import { ApiAuthorizationModule } from "src/api-authorization/api-authorization.module";
import { AuthorizeInterceptor } from "src/api-authorization/authorize.interceptor";
import { AppRoutingModule } from "../app-routing.module";
import { ApplicationSettingsRoutingModule } from "./application-settings-routing.module";
import { ApplicationSettingsComponent } from "./application-settings.component";

@NgModule({
  declarations: [
    ApplicationSettingsComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    CommonModule,
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    SidebarModule,
    RouterModule,
    ApplicationSettingsRoutingModule,
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
  bootstrap: [ApplicationSettingsComponent]
})
export class ApplicationSettingsModule { }
