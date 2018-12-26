import { Router, NavigationStart, NavigationEnd, Event } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  showLoadingIndicator = true;
  constructor(private tokenService: TokenService, private router: Router ) {

    this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.showLoadingIndicator = true;
      }
      if (routerEvent instanceof NavigationEnd) {
        this.showLoadingIndicator = false;
      }
    });
  }

  ngOnInit() {
    const token = this.tokenService.GetToken();
    if (token) {
      this.router.navigate(['streams']);
    } else {
      this.router.navigate(['']);
    }
  }
}
