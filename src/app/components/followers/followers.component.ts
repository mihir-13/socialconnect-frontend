import { UsersService } from './../../services/users.service';
import { TokenService } from 'src/app/services/token.service';
import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {

  followers = [];
  user: any;
  socket: any;

  constructor(private tokenService: TokenService, private usersService: UsersService) {
    this.socket = io('http://localhost:3000');
   }

  ngOnInit() {
    this.init();
    this.GetUser();
    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }

  init() {
    this.user = this.tokenService.GetPayload();
  }

  GetUser() {
    this.usersService.GetUserById(this.user._id).subscribe(data => {
      this.followers = data.result.followers;
    }, err => console.log(err));
  }

}
