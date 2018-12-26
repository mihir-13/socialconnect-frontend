import { Router } from '@angular/router';
import { UsersService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  users = [];
  loggedInUser: any;
  userArr = [];
  socket: any;
  onlineUsers = [];

  constructor(private usersService: UsersService, private tokenService: TokenService, private router: Router ) {
    this.socket = io('http://localhost:3000');
   }

  ngOnInit() {
    this.loggedInUser = this.tokenService.GetPayload();
    this.GetUsers();
    this.GetUser();
    this.socket.on('refreshPage', () => {
      this.GetUsers();
      this.GetUser();
    });
  }

  GetUsers() {
    this.usersService.GetAllUser().subscribe(data => {
      _.remove(data.result, { username: this.loggedInUser.username });
      this.users = data.result;
    });
  }

  GetUser() {
    this.usersService.GetUserById(this.loggedInUser._id).subscribe(data => {
     // this.users = data.result;
     this.userArr = data.result.following;
    });
  }

  FollowUser(user) {
    this.usersService.FollowUser(user._id).subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }

  CheckInArray(arr, id) {
    const result = _.find(arr, ['userFollowed._id', id]);
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  ViewUser(user) {
    this.router.navigate([user.username]);
    if (this.loggedInUser.username !== user.username) {
     // console.log(user.username);
      this.usersService.ProfileNotifications(user._id).subscribe(data => {
        this.socket.emit('refresh', {});
      }, err => console.log(err));
    }
  }

  onilne(event) {
    this.onlineUsers = event;
  }

  checkIfOnline(name) {
    const result = _.indexOf(this.onlineUsers, name);
    if (result > -1) {
      return true;
    } else {
      return false;
    }
  }

}
