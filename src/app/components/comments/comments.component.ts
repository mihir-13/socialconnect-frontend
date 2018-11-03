import { PostService } from 'src/app/services/post.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import io from 'socket.io-client';
import * as moment from 'moment';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit {

  toolbarElement: any;
  socket: any;
  commentForm: FormGroup;
  postId: any;
  commentsArray = [];
  post: string;

  constructor(private fb: FormBuilder, private postService: PostService, private route: ActivatedRoute,
    private tokenService: TokenService, private router: Router) {
    this.socket = io('http://localhost:3000');
   }

  ngOnInit() {
    this.toolbarElement = document.querySelector('.nav-content');
    this.postId = this.route.snapshot.paramMap.get('id');
    this.init();
    this.GetPost();
    this.socket.on('refreshPage', data => {
      this.GetPost();
    });
  }

  init() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none';
  }

  addComment() {
    console.log(this.commentForm.value);
    this.postService.addComment(this.postId, this.commentForm.value.comment).subscribe(data => {
      this.socket.emit('refresh', {});
      this.commentForm.reset();
    }, err => {
      if (err.error.token === null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    });
  }

  GetPost() {
    this.postService.getPost(this.postId).subscribe(data => {
      this.post = data.post.post;
      this.commentsArray = data.post.comments.reverse();
      console.log(this.commentsArray);
    }, err => {
      if (err.error.token === null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    });
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }

}
