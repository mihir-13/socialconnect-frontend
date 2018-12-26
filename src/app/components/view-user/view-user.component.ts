import { TokenService } from './../../services/token.service';
import { PostService } from 'src/app/services/post.service';
import { UsersService } from 'src/app/services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as M from 'materialize-css';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit, AfterViewInit {

  toolbarElement: any;
  postsTab = false;
  followingTab = false;
  followersTab = false;
  posts = [];
  following = [];
  followers = [];
  user: any;
  name: any;
  socket: any;

  constructor(private route: ActivatedRoute, private userService: UsersService,
     private postService: PostService, private tokenService: TokenService, private router: Router) {
      this.socket = io('http://localhost:3000');
      }

  ngOnInit() {
    this.init();
  }

  init() {
    this.route.params.subscribe(params => {
      this.name = params.name;
      this.GetUserData(this.name);
    });
    this.socket.on('refreshPage', (data) => {
      this.GetUserData(this.name);
    });
    this.postsTab = true;
    const tabs = document.querySelector('.tabs');
    M.Tabs.init(tabs, {});
    this.toolbarElement = document.querySelector('.nav-content');
  }

  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none';
  }

  GetUserData(name) {
    this.userService.GetUserByUsername(name).subscribe(data => {
      this.user = data.result;
      this.posts = data.result.posts.reverse();
      this.following = data.result.following;
      this.followers = data.result.followers;
    }, err => console.log());
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }

  LikePost(post) {
    this.postService.addLikePost(post).subscribe(data => {

      this.socket.emit('refresh', {});
    }, err => {
      if (err.error.token === null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    });
  }

  CheckInLikesArray(arr, username) {
    return _.some(arr, { username: username });
  }

  ChangeTab(value) {
    if (value === 'posts')  {
      this.postsTab = true;
      this.followersTab = false;
      this.followingTab = false;
    } else if (value === 'following') {
      this.postsTab = false;
      this.followingTab = true;
      this.followersTab = false;
    } else if (value === 'followers') {
      this.postsTab = false;
      this.followingTab = false;
      this.followersTab = true;
    }
  }

}
