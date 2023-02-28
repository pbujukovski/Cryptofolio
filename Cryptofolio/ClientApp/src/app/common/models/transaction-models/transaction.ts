import { DateTime } from "@syncfusion/ej2-angular-charts";

export class Transaction{

  public Id : number = -1;

  public Date: Date = new Date;

  public Note : string = "";

  public Amount : number = -1;

  public Fee : number = -1;

  public ApplicationUserId : string = "";

  public CoinSymbol : string = "";

  constructor(data?: Partial<Transaction>) {
    Object.assign(this, data);
  }
}
