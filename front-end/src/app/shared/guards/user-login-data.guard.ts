import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { UpdateCurrentUserComponent } from 'app/users/update-current-user/update-current-user.component';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { SecurityNoticeComponent } from 'app/login/security-notice/security-notice.component';
import { LoginComponent } from 'app/login/login/login.component';

@Injectable({
  providedIn: 'root',
})
export class UserLoginDataGuard {
  constructor(private loginService: LoginService, private router: Router) {}
  canActivateChild(
    childRoute: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // userProfileSetupPages contains a list of urls that are part of the process of logging in
    // and setting up a user's profile, and they are the pages that should *not* be redirected from
    const userProfileSetupPages = [UpdateCurrentUserComponent.name, SecurityNoticeComponent.name];

    if (childRoute.component?.name) {
      if (!this.loginService.userIsAuthenticated() && childRoute.component.name !== LoginComponent.name) {
        this.router.navigate(['/login']);
        return false;
      }

      if (userProfileSetupPages.includes(childRoute.component.name)) {
        return true;
      }

      if (childRoute.component.name !== LoginComponent.name) {
        if (!this.loginService.userHasProfileData()) {
          this.router.navigate(['/committee/users/current']);
          return false;
        }
        if (!this.loginService.userHasRecentSecurityConsentDate()) {
          this.router.navigate(['/login/security-notice']);
          return false;
        }
      }
    }
    return true;
  }
}
