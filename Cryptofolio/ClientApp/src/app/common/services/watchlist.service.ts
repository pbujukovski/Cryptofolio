import { Injectable } from '@angular/core';
import { DataManager, ODataV4Adaptor, Query, ReturnOption } from '@syncfusion/ej2-data';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomSecureODataV4Adaptor } from '../custom-secure-odatav4-adaptor';
import { Coin } from '../models/coin-models/coin';
import { AddCoinToWatchlistRequest, Watchlist } from '../models/watchlist';
import { SyncfusionUtilsService } from '../syncfusion-utils';
@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  public data: DataManager;
  public queryWatchlist : Query;
  public selectedWatchlist!: Watchlist;

  watchlistChanged = new Subject();
  isLoadingChanged = new Subject();
  public WatchlistUpdate: BehaviorSubject<Watchlist> = new BehaviorSubject<Watchlist>(new Watchlist(-1, [], ''));
  publicaddCoinToWatchlistRequest: AddCoinToWatchlistRequest = new AddCoinToWatchlistRequest();

  constructor(private syncfusionUtilsService : SyncfusionUtilsService) {
    this.data = new DataManager({
      url: environment.urlWatchlists,
      adaptor:  syncfusionUtilsService.getCustomSecureODataV4Adaptor(),
      crossDomain: true,
    });

    this.queryWatchlist = new Query().expand('Coins');
    this.getWatchList();
  }

  public getWatchList(){
    this.data
    .executeQuery(this.queryWatchlist)
    .then((e: ReturnOption) => {
      var resultList = e.result as Watchlist;
      if (resultList != null ) {
        this.selectedWatchlist = resultList;
        this.WatchlistUpdate.next(this.selectedWatchlist);
      } else console.log('Result list is empty');
    })
    .catch((e) => true);
  }


  public notifyChange(success: boolean): void {
    this.watchlistChanged.next(success);
  }

  private notifyIsLoadingChange(isLoading: boolean): void {
    this.isLoadingChanged.next(isLoading);
  }

  addCoinToWatchlist(addCoinToWatchlistRequest: AddCoinToWatchlistRequest) {

    this.notifyIsLoadingChange(true);

    this.WatchlistUpdate.next(this.selectedWatchlist);

    addCoinToWatchlistRequest.WatchlistId = this.selectedWatchlist.Id;
    this.data.update('WatchlistId', addCoinToWatchlistRequest);

  }

  public getWishList() {
    //Return copy of the array WishList
    return this.selectedWatchlist;
  }

}
