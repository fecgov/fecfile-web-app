import { Component, OnInit } from '@angular/core';
import { LoginService } from './shared/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.dispatchUserLoggedInFromCookies();
  }
}

