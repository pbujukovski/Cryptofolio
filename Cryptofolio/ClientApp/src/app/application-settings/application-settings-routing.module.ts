import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { ApplicationSettingsComponent } from './application-settings.component';

const routes: Routes = [

  //{ path: '', component: AppComponent, pathMatch: 'full'},
  { path: 'application-settings', component: ApplicationSettingsComponent, pathMatch: 'full'},
  { path: '', redirectTo: 'application-settings', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class ApplicationSettingsRoutingModule { }
