import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private tokenService: TokenService, private router: Router ) {}

  ngOnInit() {
    const token = this.tokenService.GetToken();
    if (token) {
      this.router.navigate(['streams']);
    } else {
      this.router.navigate(['']);
    }
  }
}
