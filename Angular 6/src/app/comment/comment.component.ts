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
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }
  ifLoggedIn(){
    return this.userService.isLoggedIn();
  }

  onComment(){
    console.log("comment is ",this.comment);
    if(!this.userService.isLoggedIn()){
      // this.flashMessage.show('Please Login ', {cssClass: 'alert-danger ', timeout: 2000});
      // this.serverErrorMessages = 'Please Login';
      this.router.navigate(['/login']);
    }
    else if(!this.comment){
      // this.flashMessage.show('No Comment ', {cssClass: 'alert-danger position-fixed ', timeout: 2000});
      this.success = false;
      this.serverErrorMessages = 'No Comment';
    }
    else {
      this.success = true;
      this.serverErrorMessages = 'Comment posted successfully ';
      var com = this.comment;
      this.comment = '';
      this.authService.comment(com).subscribe(data => {
        console.log("comment posted ", data);
        //console.log("com",com);
        this.loadedComments.push(data);
        // this.flashMessage.show('Comment posted successfully ', {cssClass: 'alert-success position-fixed', timeout: 2000});
      })
    }
  }

}
