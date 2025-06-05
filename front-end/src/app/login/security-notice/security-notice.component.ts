import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { takeUntil } from 'rxjs';
import { Checkbox } from 'primeng/checkbox';
import { ButtonDirective } from 'primeng/button';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-security-notice',
  templateUrl: './security-notice.component.html',
  styleUrls: ['./security-notice.component.scss'],
  imports: [ReactiveFormsModule, Checkbox, ButtonDirective],
})
export class SecurityNoticeComponent extends DestroyerComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  public readonly loginService = inject(LoginService);
  private readonly usersService = inject(UsersService);
  private readonly activatedRoute = inject(ActivatedRoute);
  formSubmitted = false;
  showForm = true;
  userLoginData?: UserLoginData;
  consentText = environment.consentText;

  form = new FormGroup(
    {
      'security-consent-annual': new SubscriptionFormControl(false),
    },
    { updateOn: 'blur' },
  );

  constructor() {
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

  async signConsentForm() {
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

    const retval = await this.usersService.updateCurrentUser(updatedUserLoginData);
    this.store.dispatch(userLoginDataUpdatedAction({ payload: retval }));
    this.router.navigate(['/select-committee']);
  }
}
