import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { UpdateCurrentUserComponent } from 'app/users/update-current-user/update-current-user.component';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class UserLoginDataGuard {
  constructor(
    private loginService: LoginService,
    private router: Router) { }
  canActivateChild(childRoute: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.loginService.userHasProfileData() && childRoute.component?.name &&
      childRoute.component.name !== UpdateCurrentUserComponent.name) {
      this.router.navigate(['/committee/users/current']);
      return false;
    }
    return true;
  }
}