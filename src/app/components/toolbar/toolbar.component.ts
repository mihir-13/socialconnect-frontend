import { UsersService } from './../../services/users.service';
import { TokenService } from './../../services/token.service';
import { MessageService } from './../../services/message.service';
import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
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
export class ToolbarComponent implements OnInit, AfterViewInit {
  @Output() onlineUsers = new EventEmitter();
  user: any;
  socket: any;
  notifications = [];
  count = [];
  chatList = [];
  msgNumber = 0;
  imageId: any;
  imageVersion: any;

  constructor(private tokenService: TokenService, private router: Router, private usersService: UsersService,
    private messageService: MessageService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.init();
    this.initiliseDropdown();
    this.GetUser();
    this.socket.emit('online', { room: 'global', user: this.user.username });
    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }

  init() {
    this.user = this.tokenService.GetPayload();
  }

  ngAfterViewInit() {
    this.socket.on('usersOnline', (data) => {
      this.onlineUsers.emit(data);
    });
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
        this.imageId = data.result.picId;
        this.imageVersion = data.result.picVersion;
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

  GoToChatPage(name) {
    this.router.navigate(['chat', name]);
    this.messageService.MarkMessages(this.user.username, name).subscribe(data => {
      this.socket.emit('refresh', {});
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

  MarkAllMessages() {
    this.messageService.MarkAllMessages().subscribe(data => {
      this.socket.emit('refresh', {});
      this.msgNumber = 0;
    });
  }

}
