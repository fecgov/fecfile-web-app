import { Component, effect, inject, OnInit, Type } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginService } from 'app/shared/services/login.service';
import { UsersService } from 'app/shared/services/users.service';
import { blurActiveInput, printFormErrors } from 'app/shared/utils/form.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { userLoginDataUpdatedAction } from 'app/store/user-login-data.actions';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { Checkbox } from 'primeng/checkbox';
import { ButtonDirective } from 'primeng/button';
import { environment } from 'environments/environment';
import { ProdNoticeComponent } from './prod-notice.component';
import { DevNoticeComponent } from './dev-notice.component';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-security-notice',
  templateUrl: './security-notice.component.html',
  styleUrls: ['./security-notice.component.scss'],
  imports: [ReactiveFormsModule, Checkbox, ButtonDirective, NgComponentOutlet],
})
export class SecurityNoticeComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  public readonly loginService = inject(LoginService);
  private readonly usersService = inject(UsersService);
  private readonly activatedRoute = inject(ActivatedRoute);
  formSubmitted = false;
  showForm = true;
  readonly userLoginData = this.store.selectSignal(selectUserLoginData);

  readonly form = new FormGroup(
    {
      'security-consent-annual': new SubscriptionFormControl(false),
    },
    { updateOn: 'blur' },
  );
  readonly componentToLoad: Type<ProdNoticeComponent> | Type<DevNoticeComponent> = environment.production
    ? ProdNoticeComponent
    : DevNoticeComponent;

  constructor() {
    this.activatedRoute.data.subscribe((d) => {
      this.showForm = !!d['backgroundStyle'];
    });

    effect(() => {
      this.userLoginData();
      this.formSubmitted = false;
    });
  }

  ngOnInit() {
    this.formSubmitted = false;
  }

  async signConsentForm() {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    if (this.form.invalid) printFormErrors(this.form);
    if (this.form.invalid || !this.userLoginData()) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }
    const updatedUserLoginData = { ...this.userLoginData() };
    if (this.form.get('security-consent-annual')?.value) {
      updatedUserLoginData.consent_for_one_year = true;
    }

    const retval = await this.usersService.updateCurrentUser(updatedUserLoginData);
    this.store.dispatch(userLoginDataUpdatedAction({ payload: retval }));
    this.router.navigate(['/select-committee']);
  }
}
