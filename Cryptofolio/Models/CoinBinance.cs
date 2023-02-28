namespace Cryptofolio.Models
{
	public class CoinBinance
	{
		public string askPrice { get; set; } = string.Empty;

	    public string askQty { get; set; } = string.Empty;

/*  public bidPrice : string = "";

  public bidQty : string = "";

  public closeTime : number = -1;

  public count : number = -1;

  public firstId : number = -1;

  public highPrice : string = "";

  public lastId : number = -1;*/

		public string lastPrice { get; set; } = string.Empty;
/*		public lastQty : string = "";

  public lowPrice : string = "";

  public openPrice : string = "";

  public openTime : number = -1;

  public prevClosePrice : string = "";

  public priceChange : string = "";

  public priceChangePercent : string = "";

  public quoteVolume : string = "";*/

  public string symbol { get; set; } = string.Empty;
/*
		public volume : string = "";*/

  public  string weightedAvgPrice { get; set; } = string.Empty;

/*		public name : string = "";

  public iconPath : string = "";

  public color : string = "";

  public marketCap : number = -1;*/

	}
}
