import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';

@Component({
  selector: 'app-top-streams',
  templateUrl: './top-streams.component.html',
  styleUrls: ['./top-streams.component.css']
})
export class TopStreamsComponent implements OnInit {

  socket: any;
  topPosts = [];
  user: any;

  constructor(private postService: PostService, private tokenService: TokenService, private router: Router) {
    this.socket = io('http://localhost:3000');
    }

  ngOnInit() {
    this.user = this.tokenService.GetPayload();
    this.AllPosts();
    this.socket.on('refreshPage', (data) => {
      this.AllPosts();
    });
  }

  AllPosts() {
    this.postService.getAllPost().subscribe(data => {
      this.topPosts = data.top;
    }, err => {
      if (err.error.token === null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    });
  }

  LikePost(post) {
    this.postService.addLikePost(post).subscribe(data => {
      console.log('Liked post', data);
      this.socket.emit('refresh', {});
    }, err => {
      if (err.error.token === null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    });
  }

  OpenComment(post) {
    this.router.navigate(['post', post._id]);
  }

  CheckInLikesArray(arr, username) {
    return _.some(arr, { username: username });
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }

}
