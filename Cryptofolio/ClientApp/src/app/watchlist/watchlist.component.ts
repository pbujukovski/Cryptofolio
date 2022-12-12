import { Component, OnInit } from '@angular/core';
import { DataManager, ODataV4Adaptor, Query, ReturnOption } from '@syncfusion/ej2-data';
import { environment } from 'src/environments/environment';
import { Watchlist } from '../common/models/watchlist';
import { BinanceApiService } from '../common/services/binance-api.service';
import { WatchlistService } from '../common/services/watchlist.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  // public data: DataManager;
  // public queryWatchlist : Query;
  public dataWatchlist!: Watchlist;
  constructor(public binanceApiService: BinanceApiService,public watchlistService: WatchlistService) {

  //   this.data = new DataManager({
  //     url: environment.urlWatchlists,
  //     adaptor: new ODataV4Adaptor( { updateType: 'PUT' }),
  //     crossDomain: true,
  //   });

  //   this.queryWatchlist = new Query();


  //   this.data
  //   .executeQuery(this.queryWatchlist)
  //   .then((e: ReturnOption) => {
  //     var resultList = e.result as Watchlist;
  //     console.log(e.result);
  //     if (resultList != null ) {
  //       this.selectedWatchlist = resultList;
  //       console.log(this.selectedWatchlist);
  //       // this.backUpBuilding = { ...resultList[0] };
  //     } else console.log('Result list is empty');
  //   })
  //   .catch((e) => true);

  }



  ngOnInit(): void {
    this.watchlistService.getWishList();

    this.watchlistService.WatchlistUpdate.subscribe(watchlist => { this.dataWatchlist
      console.log(this.dataWatchlist);
    });


  }


}
