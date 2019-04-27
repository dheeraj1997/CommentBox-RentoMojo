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

  ifLoggedIn(){
    return this.userService.isLoggedIn();
  }

  onComment(){
    console.log("comment is ",this.comment);
    if(!this.userService.isLoggedIn()){
      this.serverErrorMessages = 'Please Login';
      setTimeout(() => {
        this.serverErrorMessages = '';
        this.router.navigateByUrl('/login');
      }, 2000);
    }
    else if(!this.comment){
      this.serverErrorMessages = 'No Comment';
      setTimeout(() => {
        this.serverErrorMessages = '';
      }, 2000);
      this.success = false;
    }
    else {
      this.success = true;
      this.serverErrorMessages = 'Success';
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

}
