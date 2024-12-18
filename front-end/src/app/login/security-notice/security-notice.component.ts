import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { UserLoginData } from 'app/shared/models/user.model';
import { LoginService } from 'app/shared/services/login.service';
import { UsersService } from 'app/shared/services/users.service';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
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
      'security-consent-annual': new SubscriptionFormControl(false),
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
      updatedUserLoginData.consent_for_one_year = true;
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
