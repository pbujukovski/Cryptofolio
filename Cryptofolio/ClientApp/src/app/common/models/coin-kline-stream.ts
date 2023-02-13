export class CoinKlineStream{
 public OpenTime: number = -1;                 // representing the start time of the candle in Unix timestamp format.
 public OpenPrice: number = -1;                // representing the opening price of the candle.
 public HighPrice: number = -1;                // representing the highest price of the candle.
 public LowPrice: number = -1;                 // representing the lowest price of the candle.
 public ClosePrice: number = -1                // representing the closing price of the candle.
 public Volume: number = -1;                   // representing the volume traded during the candle.
 public CloseTime: Date = new Date;            // representing the end time of the candle in Unix timestamp format.
 public QuoteAssetVolume: number = -1;         // representing the volume of the quote asset traded during the candle.
 public NumberOfTrades: number = -1;           // representing the number of trades that occurred during the candle.
 public TakerBuyBaseAssetVolume: number = -1;  //representing the volume of the base asset bought by taker orders during the candle.
 public TakerBuyQuoteAssetVolume: number = -1; //representing the volume of the quote asset bought by taker orders during the candle.
}
