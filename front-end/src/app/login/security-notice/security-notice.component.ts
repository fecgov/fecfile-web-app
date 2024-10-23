import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { UserLoginData } from 'app/shared/models/user.model';
import { LoginService } from 'app/shared/services/login.service';
import { UsersService } from 'app/shared/services/users.service';
import { DateUtils } from 'app/shared/utils/date.utils';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { userLoginDataUpdatedAction } from 'app/store/user-login-data.actions';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-security-notice',
  templateUrl: './security-notice.component.html',
  styleUrls: ['./security-notice.component.scss'],
})
export class SecurityNoticeComponent extends DestroyerComponent implements OnInit {
  public localLoginAvailable = false;
  formSubmitted = false;
  showForm = true;
  userLoginData?: UserLoginData;

  form = new FormGroup(
    {
      'security-consent-annual': new FormControl(false),
    },
    { updateOn: 'blur' },
  );

  constructor(
    private store: Store,
    private router: Router,
    public loginService: LoginService,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
    this.activatedRoute.data.subscribe((d) => {
      this.showForm = !!d['backgroundStyle'];
    });
  }

  ngOnInit() {
    this.formSubmitted = false;

    this.store
      .select(selectUserLoginData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((userLoginData: UserLoginData) => {
        this.formSubmitted = false;
        this.userLoginData = userLoginData;
      });
  }

  signConsentForm() {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    if (this.form.invalid || !this.userLoginData) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }
    const updatedUserLoginData = { ...this.userLoginData };
    if (this.form.get('security-consent-annual')?.value) {
      const one_year_ahead = new Date();
      one_year_ahead.setFullYear(one_year_ahead.getFullYear() + 1);
      updatedUserLoginData.security_consent_exp_date = DateUtils.convertDateToFecFormat(one_year_ahead) as string;
    } else {
      updatedUserLoginData.temporary_security_consent = true;
      updatedUserLoginData.security_consent_exp_date = undefined;
    }

    this.usersService
      .updateCurrentUser(updatedUserLoginData)
      .pipe(
        map(() => {
          this.store.dispatch(userLoginDataUpdatedAction({ payload: updatedUserLoginData }));
          this.router.navigate(['/dashboard']);
        }),
      )
      .subscribe();
  }
}
