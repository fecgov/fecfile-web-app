import { Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginService } from 'app/shared/services/login.service';
import { UsersService } from 'app/shared/services/users.service';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { userLoginDataUpdatedAction } from 'app/store/user-login-data.actions';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { Checkbox } from 'primeng/checkbox';
import { ButtonDirective } from 'primeng/button';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-security-notice',
  templateUrl: './security-notice.component.html',
  styleUrls: ['./security-notice.component.scss'],
  imports: [ReactiveFormsModule, Checkbox, ButtonDirective],
})
export class SecurityNoticeComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  public readonly loginService = inject(LoginService);
  private readonly usersService = inject(UsersService);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly data = toSignal(this.activatedRoute.data, { initialValue: {} as Data });
  readonly showForm = computed(() => !!this.data()['backgroundStyle']);
  readonly userLoginData = this.store.selectSignal(selectUserLoginData);

  form = new FormGroup(
    {
      'security-consent-annual': new FormControl(false),
    },
    { updateOn: 'blur' },
  );

  async signConsentForm() {
    blurActiveInput(this.form);
    if (this.form.invalid || !this.userLoginData) {
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
