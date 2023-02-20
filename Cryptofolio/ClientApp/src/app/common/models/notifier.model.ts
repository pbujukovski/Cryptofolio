export class Notifier {
  public Id : number = -1;
  public DesiredPrice : number = -1;
  public DueDate : Date | undefined;
  public isHigher : boolean = false;
  public CoinSymbol : string = '';
  public ApplicationUserId : string = '';
}
