import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { CryptoDetailsComponent } from './crypto-details/crypto-details.component';
import { CryptoGridComponent } from './crypto-grid/crypto-grid.component';
import { HomeComponent } from './home/home.component';
import { NotifyerComponent } from './notifyer/notifyer.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { TransactionDetailsComponent } from './portfolio/transaction-details/transaction-details.component';
import { WatchlistComponent } from './watchlist/watchlist.component';

const routes: Routes = [

  //{ path: '', component: AppComponent, pathMatch: 'full'},
  { path: 'home', component: HomeComponent, pathMatch: 'full'},
  { path: 'cryptos', component: CryptoGridComponent },
  { path: 'crypto-details', component: CryptoDetailsComponent,},
  { path: 'watchlist', component: WatchlistComponent},
  { path: 'notifyler', component: NotifyerComponent},
  { path: 'portfolio', component: PortfolioComponent},
  { path: 'transaction-details', component: TransactionDetailsComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
