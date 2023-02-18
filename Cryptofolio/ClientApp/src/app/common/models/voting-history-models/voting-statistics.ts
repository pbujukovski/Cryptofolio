import { VoteStatus } from "./voting-history";

export class VotingStatistics{
    public  BullishCount : number = -1;
    public  BearishCount : number = -1;
    public  CurrentUserVoted : boolean = false;
    public  Date : Date = new Date;
}
