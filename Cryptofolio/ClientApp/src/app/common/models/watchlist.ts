import { ApplicationUser } from "./application-user";
import { Coin } from "./coin";

export class Watchlist {

  public Id : number = -1;
  public ApplicationUserId : number = -1;
  public ApplicationUser!: ApplicationUser;
  public Coins: Coin[] = [];
}
