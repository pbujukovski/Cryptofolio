import { DateTime } from "@syncfusion/ej2-angular-charts";

export class Transaction{

  public ['@odata.type'] = '';

  public Id : number = -1;

  public Date: Date = new Date;

  public Note : string = "";

  public Amount : number = 0;

  public Fee : number = 0;

  public ApplicationUserId : string = "";

  public CoinSymbol : string = "";

  // public Price : number = 0;

  constructor(data?: Partial<Transaction>) {
    Object.assign(this, data);
  }
}
