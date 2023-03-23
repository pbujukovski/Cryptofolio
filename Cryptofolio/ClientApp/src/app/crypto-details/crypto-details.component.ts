import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EditSettingsModel, PagerComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { RichTextEditorComponent, ToolbarItems } from '@syncfusion/ej2-angular-richtexteditor';
import { DataManager, Query,ODataV4Adaptor,Predicate,ReturnOption } from '@syncfusion/ej2-data';
import { cryptoSymbol } from 'crypto-symbol';
import { BehaviorSubject, concatMap, ObservableInput, Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coin } from '../common/models/coin-models/coin';
import { CoinBinance } from '../common/models/coin-models/coin-binance';
import { CoinSocket } from '../common/models/coin-models/coin-socket';
import { Comment } from '../common/models/comment';
import { VotingHistory, VoteStatus } from '../common/models/voting-history-models/voting-history';
import { VotingStatistics } from '../common/models/voting-history-models/voting-statistics';
import { AddCoinToWatchlistRequest, Watchlist } from '../common/models/watchlist';
import { BinanceApiService } from '../common/services/binance-api.service';
import { WatchlistService } from '../common/services/watchlist.service';
import { SyncfusionUtilsService } from '../common/syncfusion-utils';

const { nameLookup } = cryptoSymbol({});

@Component({
  selector: 'app-crypto-details',
  templateUrl: './crypto-details.component.html',
  styleUrls: ['./crypto-details.component.css']
})
export class CryptoDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

    //Toolbar settings
    public tools: object = {
      type: 'MultiRow',
      items: [
        'Bold',
        'Italic',
        'Underline',
        '|',
        'CreateLink',
        '|',
        'NumberFormatList',
        'BulletFormatList',
      ],
      enable: false,
    };

    public value: string = ''; //Defining the value for toolbar
    public addComment: boolean = false; //Define adding new comment as false
    public Math = Math;
    public pageSettings!: PageSettingsModel;
    public editSettings!: EditSettingsModel;
    public toolbar!: ToolbarItems[] | object;
    public selectedCommentIndex: number = -1; //Define selected comment

    public coinWatchlist: Coin = new Coin();
    public communicationError: boolean = false;
    private subcriptionCommunicationError!: Subscription;
    public subscriptionBinance!: Subscription;
    public dataComment!: DataManager;
    public queryComments!: Query;
    public selectedComment!: Comment;
    public backUpComment!: Comment;
    public comments: Comment[] = [];
    public isEdit: boolean = false; //For selecting row from grid initial value false
    public editingComment: boolean = false; //For selecting comment for edditing initial value false
    public disableEditButton: boolean = false; //For disabling edit button for comment from other users initial value false

    public watchlistSubscription!: Subscription;
    public dataWatchlist!: Watchlist;

    public isInWishlist : boolean = false;


  public watchlist: Watchlist = new Watchlist(-1, [], '');

  public starIndicator: boolean = false;
    public coinBinance: CoinBinance = new CoinBinance;
  public addCoinToWatchlistRequest: AddCoinToWatchlistRequest =
    new AddCoinToWatchlistRequest();

  @ViewChild('commentForm') public commentForm!: FormGroup; //Initialize new comment form
  @ViewChild('toolsRTE') public rteObj?: RichTextEditorComponent; //Rich Text Editor Toolbar
  @ViewChild('commentEditForm') public commentEditForm!: FormGroup; //Initialize comment edit form
  @ViewChild('pageGrid') public pageGrid!: PagerComponent;
  @ViewChild('commentPager') public commentPager?: PagerComponent; //Pager for comment section
  // @Input('selectedSymbol') public modelData!: string;


    public votingHistory!: VotingHistory;
    public votingStatistics!: VotingStatistics;
    public VoteStatus! : VoteStatus;
    public dataVotingHistory!: DataManager;

    public queryVotingHistory!: Query;

     public coinSymbol : string = "";

  public counterPager(): number {
    let number = 0;
    if (
      this.commentPager != null &&
      this.commentPager != undefined &&
      this.selectedComment != null &&
      this.selectedComment != undefined &&
      this.comments != null &&
      this.commentPager.pageSize != undefined
    ) {
      if (
        this.commentPager.currentPage * this.commentPager.pageSize <=
        this.comments.length
      ) {
        number = this.commentPager.pageSize;
      } else {
        if (this.comments.length > this.commentPager.pageSize) {
          number =
          this.comments.length % this.commentPager.pageSize;
        } else {
          number = this.comments.length;
        }
      }
    }

    return number;
  }

  public getOffsetCommentIndex(i: number): number {
    let offsetIndex = 0;
    if (this.commentPager != null && this.commentPager != undefined) {
      offsetIndex =
        (this.commentPager.currentPage - 1) * this.commentPager.pageSize + i;
    }
    return offsetIndex;
  }

  public lastPrice : number = -1;
  public dollarCurr: Intl.NumberFormat = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'});


    @ViewChild('myDiv') myDiv!: ElementRef;
  public binanceWebSocket : WebSocket;

  public binanceWebSocket24 : WebSocket;
  public coin!: CoinSocket;
  constructor(private binanceApiService: BinanceApiService,  public router: Router,private watchlistService : WatchlistService , private syncfusionUtilsService : SyncfusionUtilsService ) {

    const binanceApiObsearvable$ = timer(1000, 20000);

        //Getting data for Comments
        this.dataComment = new DataManager({
          url: environment.urlComments,
          adaptor: syncfusionUtilsService.getCustomSecureODataV4Adaptor(),
          crossDomain: true,
        });


        //Getting data for Voting History
        this.dataVotingHistory = new DataManager({
        url: environment.urlVotingHistories,
        adaptor: syncfusionUtilsService.getCustomSecureODataV4Adaptor(),
        crossDomain: true,
        });

    this.binanceApiService.coinSymbol.subscribe(coinSymbol => this.coinSymbol = coinSymbol);
    if (this.coinSymbol === ''){
      this.router.navigate(['cryptos']);
    }
    this.coinSymbol.toLocaleLowerCase()


    this.queryComments = new Query().addParams(
      'CoinSymbol',
      this.coinSymbol
    ).sortByDesc("Date");
    this.dataComment
    .executeQuery(this.queryComments)
    .then((e: ReturnOption) => {
      var resultList = e.result as Comment[];
      if (resultList != null ) {
        this.comments = resultList;
      } else console.error('Result list is empty');
    })
    .catch((e) => true);



    this.queryVotingHistory = new Query().addParams(
      'CoinSymbol',
      this.coinSymbol
    );


    this.dataVotingHistory
    .executeQuery(this.queryVotingHistory)
    .then((e: ReturnOption) => {
      var result = e.result as VotingStatistics;
      if (result != null ) {
        this.votingStatistics = result as VotingStatistics;
      } else console.error('Result list is empty');
    })
    .catch((e) => true);

    this.binanceWebSocket = new WebSocket("wss://stream.binance.com:9443/ws/" + this.coinSymbol.toLowerCase() + "usdt@trade");


    this.binanceWebSocket24 = new WebSocket("wss://stream.binance.com:9443/ws/" + this.coinSymbol.toLowerCase() + "usdt@ticker");
    let checkUrl = ("wss://stream.binance.com:9443/ws/usdt@trade")






    this.binanceWebSocket24.onmessage = (event) => {
    }


    this.watchlistService.getWatchList();

    this.watchlistSubscription = this.watchlistService.WatchlistUpdate.subscribe(watchlist => {
      this.dataWatchlist = watchlist;
     });

   this.subscriptionBinance =  binanceApiObsearvable$
     .pipe(concatMap(() => this.binanceApiService.getCoin(this.coinSymbol)))
     .subscribe();

    this.subscriptionBinance =  this.binanceApiService.CoinUpdated.subscribe(data =>{
      this.coinBinance = data

    }

      );

  }

  ngOnInit(): void {

    this.selectedComment = Object.assign({}) as Comment;
    this.votingHistory = Object.assign({}) as VotingHistory;

    var predicate: Predicate = new Predicate(
      'Id',
      'equal',
      this.selectedComment.Id
    ); //Adding predicate to be equal as CommentId
    this.queryComments.queries = [];
    this.queryComments.where(predicate);

  }

  ngAfterViewInit() {

    const binanceApiObsearvable$ = timer(500, 6000);
      binanceApiObsearvable$
     .pipe(concatMap(() => this.WebSocketData()))
     .subscribe();

  }

  public WebSocketData() : any {
    this.binanceWebSocket.onmessage = (event) => {
      this.coin = JSON.parse(event.data);
      const splitName = this.coin.s.split('USDT').find((x) => x !== 'USDT') ?? '';
      this.coin.iconPath = './assets/icon/' + `${splitName.toLowerCase()}` + '.png';
      this.coin.p = this.dollarCurr.format(parseFloat(this.coin.p));
      this.coin.name = nameLookup(splitName) ?? splitName;
      this.coin.s = splitName;

      var coinPrice = Number(this.coin.p.replace(/[^0-9.-]+/g,""));


      if (this.myDiv.nativeElement != undefined && this.myDiv.nativeElement.style != undefined){
      this.myDiv.nativeElement.style.color = !this.lastPrice || this.lastPrice === coinPrice ? 'black' : coinPrice > this.lastPrice ? 'green' : 'red';
      }
      this.lastPrice = coinPrice;
    }
  }

  ngOnDestroy(): void{
    this.subscriptionBinance.unsubscribe();
    this.binanceWebSocket.close();
  }

  onCancel(): void {
    this.router.navigate(['cryptos']);
  }

  onBackComments = (commentRTE: Object): void => {
    if (this.coinSymbol != undefined) {
      this.selectedCommentIndex = -1;

      //Original copy from
     // this.selectedComment = { ...this.backUpComment }; //Setting backup for comments
      this.editingComment = false; //Changing state for editing comment
      this.disableEditButton = false; //Disabling edit button
      (commentRTE as RichTextEditorComponent).toolbarSettings.enable = false;
      (commentRTE as RichTextEditorComponent).setDisabledState(true);
      //(commentRTE as RichTextEditorComponent).refresh();
    }
  };

  onEditComments = (commentRTE: Object, itemIndex: number): void => {
    // this.disableEditButton = true;
     this.editingComment = true;
    this.selectedCommentIndex = itemIndex;

    if (this.coinSymbol != undefined) {
      this.selectedCommentIndex = itemIndex;
      (commentRTE as RichTextEditorComponent).toolbarSettings.enable = true; //Set value for toolbar settings in comment section
      (commentRTE as RichTextEditorComponent).setDisabledState(false); //Define state for toolbar in comment section
      //(commentRTE as RichTextEditorComponent).refreshUI(); //Refresh the toolbar at comment section
      this.backUpComment = { ...this.selectedComment }; //Backing up original copy
    }
  };

  //Submit new comment
  onSubmitComment = (commentRTE: Object): void => {
    if (this.commentForm.valid && this.coinSymbol != null) {
      this.selectedComment.CoinSymbol = this.coinSymbol;
      var temp = this.dataComment.insert(
        this.selectedComment
      ) as Promise<Comment>; //Waiting response from backend to be sure that new comment comes with ID.
      temp.then((value: Comment) => {
        if (this.coinSymbol != null) {
          // this.comments.push((value)); //Adding comment to list after the response from the promise
          this.comments.unshift(value);
        }
      });
      this.commentForm.reset();
      this.addComment = false;
    }
  };

  //Submit edited comment
  onSubmitEditedComment(commentRTE: Object, i: number): void {
    //Send updated request from edited comment form
    this.selectedCommentIndex = -1;
    if (this.coinSymbol != null) {
      this.comments[i].Text = (
        commentRTE as RichTextEditorComponent
      ).value;
      this.backUpComment = { ...this.selectedComment };
      this.dataComment.update('Id', this.comments[i]); //Send updated comment to backend
      (commentRTE as RichTextEditorComponent).toolbarSettings.enable = false; //Set value for toolbar settings in comment section
      (commentRTE as RichTextEditorComponent).setDisabledState(true); //Define state for toolbar in comment section
      //(commentRTE as RichTextEditorComponent).refresh(); //Refresh the toolbar at comment section

      this.editingComment = false;
    }
  }

  //Delete existing comment
  onDeleteEditedComment(i: number, commentRTE: Object): void {
    if (this.coinSymbol != null) {
      this.dataComment.remove('Id', this.comments[i]); //Remove selected comment from database
      this.comments.splice(i, 1); //Delete one element from selectedTicket list
      this.selectedCommentIndex = -1; //Clear value for selected comment
      this.editingComment = false; //Changing state for editing comment
      (commentRTE as RichTextEditorComponent).toolbarSettings.enable = false;
      (commentRTE as RichTextEditorComponent).setDisabledState(true);
      //(commentRTE as RichTextEditorComponent).refresh();
    }
  }

  //Adding new comment
  onAddNewComment(commentRTE: Object): void {
    this.addComment = true;
    (commentRTE as RichTextEditorComponent).toolbarSettings.enable = true;
    this.selectedComment = { ...this.backUpComment };

  }

  //Closing the new comment form and backing up the data
  onBackNewComment(commentRTE: Object): void {
    //(commentRTE as RichTextEditorComponent).toolbarSettings.enable = false;
    this.selectedComment = { ...this.backUpComment };
    this.addComment = false;
  }

  //See if any changes are made in the add new comment section
  onChange(args: RichTextEditorComponent) {
    if (
      args
        .getText()
        .trim()
        .replace(/\u200B/g, '').length >= 0
    ) {
      this.addComment = true;
    } else {
      this.addComment = false;
    }
  }

  onBullishClicked(){
      this.votingHistory!.CoinSymbol = this.coinSymbol;
      this.votingHistory!.Status = VoteStatus.Bullish;

      var temp = this.dataVotingHistory.insert(
        this.votingHistory
      ) as Promise<VotingStatistics>; //Waiting response from backend to be sure that new comment comes with ID.
      temp.then((value: VotingStatistics) => {
        if (this.coinSymbol != null) {

         this.votingStatistics = value; //Adding comment to list after the response from the promise
         this.dataVotingHistory
    .executeQuery(this.queryVotingHistory)
    .then((e: ReturnOption) => {
      var result = e.result as VotingStatistics;

      if (result != null ) {
        this.votingStatistics = result as VotingStatistics;
      } else console.error('Result list is empty');
    })
    .catch((e) => true);
        }
      });
      console.log(this.votingStatistics)
    }


  onBearishClicked(){
    this.votingHistory.CoinSymbol = this.coinSymbol;
    this.votingHistory.Status = VoteStatus.Bearish;
    var temp = this.dataVotingHistory.insert(
      this.votingHistory
    ) as Promise<VotingStatistics>; //Waiting response from backend to be sure that new comment comes with ID.
    temp.then((value: VotingStatistics) => {
      if (this.coinSymbol != null) {
        console.log(value);
       this.votingStatistics = value; //Adding comment to list after the response from the promise
       this.dataVotingHistory
  .executeQuery(this.queryVotingHistory)
  .then((e: ReturnOption) => {
    var result = e.result as VotingStatistics;
    console.log(e.result);
    if (result != null ) {
      this.votingStatistics = result as VotingStatistics;
      console.log(this.votingStatistics);
    } else console.log('Result list is empty');
  })
  .catch((e) => true);
      }
    });
    console.log(this.votingStatistics)

  }

  public onAddToWatchlist(coinSymbol : string) {
    console.log('this.selectedSymbol');

    var exists = this.dataWatchlist.Coins.some(coinExists => coinSymbol == coinExists.Symbol);

    this.coinWatchlist.Symbol = coinSymbol;
    if(exists == true){
      const index = this.dataWatchlist.Coins.findIndex(coinExists => coinSymbol == coinExists.Symbol);
      this.dataWatchlist.Coins.splice(index,1);
    }
    else{
      this.dataWatchlist.Coins.push(this.coinWatchlist);
    }

    // console.log("test.symbol");
    // console.log(test.symbol);
    this.addCoinToWatchlistRequest.CoinSymbol = coinSymbol;
    this.addCoinToWatchlistRequest.StarIndicator = true;
    this.watchlistService.addCoinToWatchlist(this.addCoinToWatchlistRequest);
  }

  public setCheckedValue(coinSymbol: string)  : boolean{
    return this.dataWatchlist.Coins.find(c => c.Symbol == coinSymbol) != null;
    }
}
