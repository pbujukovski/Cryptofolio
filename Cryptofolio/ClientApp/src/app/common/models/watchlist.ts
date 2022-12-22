import { ApplicationUser } from "./application-user";
import { Coin } from "./coin";

export class Watchlist {

  public Id : number = -1;
  public ApplicationUserId : string = '';
  // public ApplicationUser!: ApplicationUser;
  public Coins: Coin[] = [];

  constructor(Id: number, Coins: Coin[], ApplicationUserId : string) {
    this.Id = Id;
    this.Coins = Coins;
    this.ApplicationUserId = ApplicationUserId;
  }
}


export class AddCoinToWatchlistRequest {
  public WatchlistId : number = -1;
  public CoinSymbol : string = "";
  public StarIndicator : boolean = false;
}
