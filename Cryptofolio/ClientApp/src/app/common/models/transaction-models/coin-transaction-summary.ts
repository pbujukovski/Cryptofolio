export class CoinTransactionSummary{

  public CoinSymbol : string = '';
  public Price : number = -1;
  public Quantity : number = 0;
  public AvgBuyPrice : number = 0;
  public ProfitLoss : number = 0;
}

export class TransactionSummaryGrid{

  public CoinSymbol : string = '';
  public ImgPath: string = '';
  public CoinName: string ='';
  public Price : string = "";
  public HoldingsPrice: number = 0;
  public Quantity : number = 0;
  public AvgBuyPrice : number = 0;
  public ProfitLoss : number = 0;
  public PercentageChange : string = '';
  // public Id: string = '';
}

