import { Injectable } from '@angular/core';
import { DataManager, ODataV4Adaptor, Query, ReturnOption } from '@syncfusion/ej2-data';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomSecureODataV4Adaptor } from '../custom-secure-odatav4-adaptor';
import { Watchlist } from '../models/watchlist';
import { SyncfusionUtilsService } from '../syncfusion-utils';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  public data: DataManager;
  public queryWatchlist : Query;
  public selectedWatchlist!: Watchlist;


  watchlistChanged = new Subject();
  isLoadingChanged = new Subject();
  public WatchlistUpdate: BehaviorSubject<Watchlist> = new BehaviorSubject<Watchlist>(new Watchlist);


  constructor(private syncfusionUtilsService : SyncfusionUtilsService) {
    this.data = new DataManager({
      url: environment.urlWatchlists,
      adaptor:  syncfusionUtilsService.getCustomSecureODataV4Adaptor(),
      crossDomain: true,
    });

    this.queryWatchlist = new Query();


    this.data
    .executeQuery(this.queryWatchlist)
    .then((e: ReturnOption) => {
      var resultList = e.result as Watchlist;
      console.log(e.result);
      if (resultList != null ) {
        this.selectedWatchlist = resultList;
        console.log(this.selectedWatchlist);
        this.WatchlistUpdate.next(this.selectedWatchlist);
        // this.backUpBuilding = { ...resultList[0] };
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

  // public deleteBookFromWishList(index: number): Observable<void> {
  //   return this.api.delete(`WishLists/${this.watchlist.Coins[index].Symbol}`);

  // }
  // public updateWishList(
  //   index: number,
  //   newWishList: Watchlist
  // ): Observable<Watchlist> {
  //   return this.api.put(`WishLists/${index}`, newWishList);
  // }

  addCoinToWatchlist(watchlist: Watchlist) {
    //return this.api.post(`WishLists`, wishList);
    this.notifyIsLoadingChange(true);

    console.log("HERE");
    console.log(this.selectedWatchlist);
    console.log(watchlist);

    this.selectedWatchlist.Coins = watchlist.Coins;
    this.WatchlistUpdate.next(this.selectedWatchlist);
    console.log(this.selectedWatchlist.Id);
    console.log(this.selectedWatchlist.Id.toString());

    this.data.update('Id', this.selectedWatchlist);

      // this.watchlist.Coins = watchlist.Coins
    //Step 2: Get authors from backend;
    // this.data.insert(this.watchlist);

    // this.api.post(`WishLists`, watchlist).subscribe({
    //   next: (watchlist: Watchlist) => {
    //     console.log(watchlist);
    //     this.watchlist = watchlist;
    //     //Step 2.1: Notify User that isLoadingChange;
    //     this.notifyIsLoadingChange(false);
    //     //Step 2.2: Notify User that book  are added to list;
    //     this.notifyChange(true);
    //   },
    //   error: (err: any) => {
    //     console.error(err);
    //     this.notifyIsLoadingChange(false);
    //   },
    //   complete: () => {
    //     this.notifyIsLoadingChange(false);
    //   },
    // });
  }

  public getWishList() {
    //Return copy of the array WishList
    return this.selectedWatchlist;
  }

  // //Fetch method for WishList
  // public fetchWishList() {
  //   this.notifyIsLoadingChange(true);

  //   //Step 2: Get watchlist from from backend;
  //   this.data
  //   .executeQuery(this.queryWatchlist)
  //   .then((e: ReturnOption) => {
  //     var resultList = e.result as Watchlist[];
  //     if (resultList != null && resultList.length >= 1) {
  //       this.watchlist = resultList[0];
  //       //Step 2.1: Notify User that isLoadingChange;
  //       this.notifyIsLoadingChange(false);
  //       //Step 2.2: Notify User that coins are added to list;
  //       this.notifyChange(true);
  //       // this.backUpBuilding = { ...resultList[0] };
  //     } else console.log('Result list is empty');
  //   })
  //   .catch((e) => true);

  // }
}
