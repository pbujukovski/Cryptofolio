export class VotingHistory{
    public Id : number = -1;

    public Status: VoteStatus = VoteStatus.Unknown;

    public Date : Date = new Date;

    public  CoinSymbol : string = "";

    public  ApplicationUserId : string = "";

    public constructor(votingHistory?: VotingHistory) {
      if (votingHistory != undefined){
      this.Id = votingHistory.Id;
      this.Status = votingHistory.Status;
      this.Date = votingHistory.Date;
      this.CoinSymbol = votingHistory.CoinSymbol;
      this.ApplicationUserId = votingHistory.ApplicationUserId;
      }
  }
}
 export enum VoteStatus{
    Unknown = "Unknown",
    Bullish = "Bullish",
    Bearish = "Bearish"
}
