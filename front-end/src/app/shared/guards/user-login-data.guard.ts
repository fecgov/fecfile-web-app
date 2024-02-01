import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class UserLoginDataGuard {
  constructor(
    private loginService: LoginService,
    private router: Router) { }
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.loginService.refreshUserLoginDataIfNeeded().pipe(
      map(() => {
        if (!this.loginService.userHasProfileData()) {
          this.router.navigate(['users/update-current']);
          return false;
        }
        return true;
      })
    );
  }

}
