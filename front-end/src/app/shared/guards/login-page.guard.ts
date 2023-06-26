import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { ApiService } from 'app/shared/services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard  {
  constructor(
    private apiService: ApiService, 
    private router: Router,
    private cookieService: CookieService) { }
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.apiService.isAuthenticated()) {
      this.router.navigate(['dashboard']);
      return false;
    } else {
      this.cookieService.deleteAll();
      return true;
    }
  }

}
