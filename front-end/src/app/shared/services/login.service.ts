import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { userLoginDataDiscardedAction, userLoginDataRetrievedAction } from 'app/store/user-login-data.actions';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom, Observable, takeUntil } from 'rxjs';
import { DestroyerComponent } from '../components/app-destroyer.component';
import { UserLoginData } from '../models/user.model';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService extends DestroyerComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);
  private readonly usersService = inject(UsersService);
  public userLoginData$: Observable<UserLoginData> = this.store
    .select(selectUserLoginData)
    .pipe(takeUntil(this.destroy$));

  public logOut() {
    this.store.dispatch(userLoginDataDiscardedAction());
    if (!this.isLoggedIn() || !this.userIsAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      window.location.href = environment.loginDotGovLogoutUrl;
    }
  }

  public async hasUserLoginData(): Promise<boolean> {
    const userLoginData = await firstValueFrom(this.userLoginData$);
    return !!userLoginData.email;
  }

  public async retrieveUserLoginData(): Promise<void> {
    return this.usersService.getCurrentUser().then((userLoginData) => {
      this.store.dispatch(userLoginDataRetrievedAction({ payload: userLoginData }));
    });
  }

  public isLoggedIn() {
    return this.cookieService.get(environment.ffapiLoginDotGovCookieName) === 'true';
  }

  public async userHasProfileData(): Promise<boolean> {
    const userLoginData = await firstValueFrom(this.userLoginData$);
    return !!userLoginData?.first_name && !!userLoginData.last_name;
  }

  public async userHasConsented(): Promise<boolean> {
    const userLoginData = await firstValueFrom(this.userLoginData$);
    return !!userLoginData.security_consented;
  }

  public userIsAuthenticated() {
    return new Date() < new Date(parseInt(this.cookieService.get('ffapi_timeout')) * 1000);
  }
}
