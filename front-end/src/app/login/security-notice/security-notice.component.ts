import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { UserLoginData } from 'app/shared/models/user.model';
import { LoginService } from 'app/shared/services/login.service';
import { UsersService } from 'app/shared/services/users.service';
import { DateUtils } from 'app/shared/utils/date.utils';
import { updateUserLoginDataAction } from 'app/store/login.actions';
import { selectUserLoginData } from 'app/store/login.selectors';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-security-notice',
  templateUrl: './security-notice.component.html',
  styleUrls: ['./security-notice.component.scss'],
})
export class SecurityNoticeComponent extends DestroyerComponent implements OnInit {
  public loginDotGovAuthUrl: string | undefined;
  public localLoginAvailable = false;
  formSubmitted = false;
  userLoginData?: UserLoginData;

  form = new FormGroup({
    'security-consent': new FormControl(false, [Validators.requiredTrue]),
  });

  constructor(
    private store: Store,
    private router: Router,
    public loginService: LoginService,
    private usersService: UsersService
  ) {
    super();
  }

  ngOnInit() {
    this.formSubmitted = false;

    this.store
      .select(selectUserLoginData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((userLoginData: UserLoginData) => {
        this.formSubmitted = false;
        this.userLoginData = userLoginData;
        console.log(this.userLoginData);
      });
  }

  signConsentForm() {
    this.formSubmitted = true;
    if (this.form.invalid || !this.userLoginData) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }

    const updatedUserLoginData: UserLoginData = {
      first_name: this.userLoginData.first_name,
      last_name: this.userLoginData.last_name,
      email: this.userLoginData.email,
      security_consent_date: DateUtils.convertDateToFecFormat(new Date()) as string,
    };
    this.usersService
      .updateCurrentUser(updatedUserLoginData)
      .pipe(
        map(() => {
          this.store.dispatch(updateUserLoginDataAction({ payload: updatedUserLoginData }));
          this.router.navigate(['dashboard']);
        })
      )
      .subscribe();
  }
}
