import { Component, OnInit } from '@angular/core';
import { UserService } from "../shared/user.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  serverErrorMessages: string;
  success: boolean;
  comment: string;
  commentData: any;
  userDetails: any;

  constructor(private userService: UserService, private router: Router) {
    this.userService.getComment().subscribe( res => {
      console.log("loaded comments are ",res);
      this.commentData = res;
    });
  }

  ngOnInit() {

    if(this.userService.isLoggedIn()){
      this.userService.getUserProfile().subscribe(
        res => {
          console.log(res['user']);
          this.userDetails = res['user'];
          localStorage.setItem('id', res['id']);
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  onComment(){
    console.log("comment is ",this.comment);
    if(!this.userService.isLoggedIn()){
      this.success = false;
      this.serverErrorMessages = 'Please Login';
      setTimeout(() => {
        this.serverErrorMessages = '';
        this.router.navigateByUrl('/login');
      }, 2000);
    }
    else if(!this.comment){
      this.success = false;
      this.serverErrorMessages = 'No Comment';
      setTimeout(() => {
        this.serverErrorMessages = '';
      }, 2000);
    }
    else {
      this.success = true;
      this.serverErrorMessages = 'Comment posted successfully';
      setTimeout(() => {
        this.serverErrorMessages = '';
      }, 2000);
      var com = this.comment;
      var author_id = localStorage.getItem('id');
      var author_name = this.userDetails['fullname'];
      var dat = {com:com,author:this.userDetails};
      this.comment = '';
      this.userService.postComment(dat).subscribe(data => {
        console.log("comment posted ", data);
        console.log("com",com);
        this.commentData.push(data);
      })
    }
  }

  upvote(comment){
    console.log("upvote clicked",comment);
    if(!this.userService.isLoggedIn()){
      // this.flashMessage.show('Please Login ', {cssClass: 'alert-danger ', timeout: 2000});
      this.router.navigate(['/login']);
    }
    else{
      console.log("upvote clicked2");
      var userId = this.userDetails._id;
      if(comment.author._id == userId){
        // this.flashMessage.show('You cant upvote your own comment', {cssClass: 'alert-warning position-fixed', timeout: 2000});
        console.log('cant upvote own comment');
        this.success = false;
        this.serverErrorMessages = 'Can\'t upvote own comment';
      }
      else if(comment.downvote.includes(userId)){
        console.log("downvotes contain already ");
        // this.flashMessage.show('You have already downvoted', {cssClass: 'alert-warning position-fixed', timeout: 2000});
        // doc.upvote.push(user_id);
        this.success = false;
        this.serverErrorMessages = 'You have already downvoted';
      }
      else if(comment.upvote.includes(userId)){
        console.log("upvotes contain already ");
        // this.flashMessage.show('You have already upvoted ', {cssClass: 'alert-warning position-fixed', timeout: 2000});
        // doc.upvote.push(user_id);
        this.success = false;
        this.serverErrorMessages = 'You have already upvoted';
      }
      else {
        this.userService.upvoteComment(comment,userId).subscribe(data => {
          console.log("comment upvoted ", data);
          comment.upvote.push(userId);
          this.success = true;
          this.serverErrorMessages = 'Comment upvoted successfully';
          // this.flashMessage.show('Comment upvoted successfully ', {cssClass: 'alert-success position-fixed', timeout: 2000});
          //this.router.navigate(['/']);
        })
      }

    }
  }

  downvote(comment){
    console.log("downvote clicked",comment);
    if(!this.userService.isLoggedIn()){
      // this.flashMessage.show('Please Login ', {cssClass: 'alert-danger', timeout: 2000});
      this.router.navigate(['/login']);
    }
    else{
      console.log("downvote clicked2");
      var userId = this.userDetails._id;
      if(comment.author._id==userId){
        console.log("You cant downvote your own comment");
        this.success = false;
        this.serverErrorMessages = 'Can\'t downvote own comment';
        // this.flashMessage.show('You cant downvote your own comment', {cssClass: 'alert-warning position-fixed', timeout: 2000});

      }
      else if(comment.upvote.includes(userId)){
        console.log("upvotes contain already ");
        this.success = false;
        this.serverErrorMessages = 'You have already upvoted';
        // this.flashMessage.show('You have already upvoted', {cssClass: 'alert-warning position-fixed', timeout: 2000});
        // doc.upvote.push(user_id);
      }
      else if(comment.downvote.includes(userId)){
        console.log("downvotes contain already ");
        this.success = false;
        this.serverErrorMessages = 'You have already downvoted';
        // this.flashMessage.show('You have already downvoted', {cssClass: 'alert-warning position-fixed', timeout: 2000});
        // doc.upvote.push(user_id);
      }
      else {
        this.userService.downvoteComment(comment,userId).subscribe(data => {
          console.log("comment downvoted ", data);
          comment.downvote.push(userId)
          this.success = true;
          this.serverErrorMessages = 'Comment downvoted successfully';
          // this.flashMessage.show('Comment downvoted successfully', {cssClass: 'alert-success position-fixed', timeout: 2000});
          // this.router.navigate(['/']);
        })
      }

    }
  }

}
