import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EditSettingsModel, PagerComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { RichTextEditorComponent, ToolbarItems } from '@syncfusion/ej2-angular-richtexteditor';
import { DataManager, Query,ODataV4Adaptor,Predicate,ReturnOption } from '@syncfusion/ej2-data';


import { cryptoSymbol } from 'crypto-symbol';
import { BehaviorSubject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CoinSocket } from '../../common/models/coin-socket';
import { Comment } from '../../common/models/comment';
import { VotingHistory, VoteStatus } from '../../common/models/voting-history';
import { VotingStatistics } from '../../common/models/voting-statistics';
import { BinanceApiService } from '../../common/services/binance-api.service';
import { SyncfusionUtilsService } from '../../common/syncfusion-utils';
@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit {



    //Toolbar settings
    public tools: object = {
      type: 'MultiRow',
      items: [
        'Bold',
        'Italic',
        'Underline',
        '|',
        'CreateLink',
        'Image',
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

    public communicationError: boolean = false;
    private subcriptionCommunicationError!: Subscription;
    public dataComment!: DataManager;
    public queryComments!: Query;
    public selectedComment!: Comment;
    public backUpComment!: Comment;
    public comments: Comment[] = [];
    public isEdit: boolean = false; //For selecting row from grid initial value false
    public editingComment: boolean = false; //For selecting comment for edditing initial value false
    public disableEditButton: boolean = false; //For disabling edit button for comment from other users initial value false

  @ViewChild('commentForm') public commentForm!: FormGroup; //Initialize new comment form
  @ViewChild('toolsRTE') public rteObj?: RichTextEditorComponent; //Rich Text Editor Toolbar
  @ViewChild('commentEditForm') public commentEditForm!: FormGroup; //Initialize comment edit form
  @ViewChild('pageGrid') public pageGrid!: PagerComponent;
  @ViewChild('commentPager') public commentPager?: PagerComponent; //Pager for comment section
  // @Input('selectedSymbol') public modelData!: string;


    public votingHistory : VotingHistory = new VotingHistory;
    public votingStatistics!: VotingStatistics;

    public dataVotingHistory!: DataManager;

    public queryVotingHistory!: Query;

  @Input() public coinSymbol : string = "";

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

  constructor(private binanceApiService: BinanceApiService,  public router: Router, private syncfusionUtilsService : SyncfusionUtilsService ) {


        //Getting data for Comments
        this.dataComment = new DataManager({
          url: environment.urlComments,
          adaptor: syncfusionUtilsService.getCustomSecureODataV4Adaptor(),
          crossDomain: true,
        });

        // this.binanceApiService.coinSymbol.subscribe(coinSymbol => this.coinSymbol = coinSymbol);
   }

  ngOnInit(): void {

    this.queryComments = new Query().addParams(
      'CoinSymbol',
      this.coinSymbol
    );
    this.dataComment
    .executeQuery(this.queryComments)
    .then((e: ReturnOption) => {
      var resultList = e.result as Comment[];
      console.log(e.result);
      if (resultList != null ) {
        this.comments = resultList;
        console.log("this.comments");
        console.log(this.comments);
        // this.WatchlistUpdate.next(this.selectedWatchlist);
        // this.backUpBuilding = { ...resultList[0] };
      } else console.log('Result list is empty');
    })
    .catch((e) => true);

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
          this.comments.push((value)); //Adding comment to list after the response from the promise
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
      console.log("this.selectedTicket.Comments[i]");
        console.log(this.comments[i]);
        console.log(this.comments[i].Id);
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
      console.log(this.selectedCommentIndex);
      console.log(i);
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
    console.log("on new comment")
    console.log(this.selectedComment);

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

}
