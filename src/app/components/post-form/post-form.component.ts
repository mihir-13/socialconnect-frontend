import { TokenService } from './../../services/token.service';
import { PostService } from './../../services/post.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  socket: any;
  postForm: FormGroup;

  constructor(private fb: FormBuilder, private postService: PostService, private tokenService: TokenService,
    private router: Router) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.init();
  }

  init() {
     this.postForm = this.fb.group({
      post: ['', Validators.required]
     });
  }

  submitPost() {
    this.postService.addPost(this.postForm.value).subscribe(data => {
      console.log('Data', data);
      this.socket.emit('refresh', {});
      this.postForm.reset();
    }, err => {
      if (err.error.token === null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    });
  }

}
