import { UsersService } from './../../services/users.service';
import { TokenService } from './../../services/token.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as M from 'materialize-css';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  user: any;
  socket: any;
  notifications = [];
  count = [];
  chatList = [];
  msgNumber = 0;

  constructor(private tokenService: TokenService, private router: Router, private usersService: UsersService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.init();
    this.initiliseDropdown();
    this.GetUser();
    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }

  init() {
    this.user = this.tokenService.GetPayload();
  }

  logout() {
    this.tokenService.DeleteToken();
    this.router.navigate(['']);
  }

  GoToHome() {
    this.router.navigate(['streams']);
  }

  GetUser() {
    this.usersService.GetUserById(this.user._id).subscribe(data => {
      if (data.result.notifications) {
        this.notifications = data.result.notifications.reverse();
        const value = _.filter(this.notifications, ['read', false]);
        this.count = value;
        this.chatList = (data.result.chatList).reverse();
        console.log('CHATLIST', this.chatList);
        this.CheckIfMessageIsRead(this.chatList);
      }
      //  else {

      // }

    }, err => {
      if (err.error.token === null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    });
  }

  CheckIfMessageIsRead(arr) {
    const checkArr = [];
    for (let i = 0; i < arr.length; i++) {
      const receivr = arr[i].msgId.message[arr[i].msgId.message.length - 1];
      if (this.router.url !== `/chat/${receivr.sendername}`) {
        if (receivr.isRead === false && receivr.receivername === this.user.username ) {
           checkArr.push(1);
           this.msgNumber = _.sum(checkArr);
           console.log('Msgnumber', this.msgNumber);
        }
      }
    }
  }

  DisplayTime(time) {
    return moment(time).fromNow();
  }

  MessageDate(data) {
    return moment(data).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY'
    });
  }

  initiliseDropdown() {
    const dropDownElement = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropDownElement, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });


    const dropDownElementTwo = document.querySelectorAll('.dropdown-trigger1');
    M.Dropdown.init(dropDownElementTwo, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });
  }

  MarkAll() {
    this.usersService.MarkAllAsRead().subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }

}
