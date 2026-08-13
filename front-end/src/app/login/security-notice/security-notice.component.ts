import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginService } from 'app/shared/services/login.service';
import { UsersService } from 'app/shared/services/users.service';
import { userLoginDataUpdatedAction } from 'app/store/user-login-data.actions';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { ButtonModule } from 'primeng/button';
import { environment } from 'environments/environment';
import { ProdNoticeComponent } from './prod-notice.component';
import { DevNoticeComponent } from './dev-notice.component';
import { NgComponentOutlet } from '@angular/common';
import { injectRouteData } from 'ngxtension/inject-route-data';
import { SignalFormComponent } from 'app/shared/components/signal-form/signal-form.component';
import { form, FormRoot, FormField, disabled } from '@angular/forms/signals';
import { CheckboxInput } from 'app/shared/components/signal-inputs/checkbox-input/checkbox.input';

export const SECURITY_CONSENT_VERSION = '1';
interface SecurityConsent {
  annualConsent: boolean;
}
@Component({
  selector: 'app-security-notice',
  templateUrl: './security-notice.component.html',
  styleUrls: ['./security-notice.component.scss'],
  imports: [ButtonModule, NgComponentOutlet, FormRoot, CheckboxInput, FormField],
})
export class SecurityNoticeComponent extends SignalFormComponent<SecurityConsent> {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  readonly loginService = inject(LoginService);
  private readonly usersService = inject(UsersService);
  readonly backgroundStyle = injectRouteData('backgroundStyle');

  readonly showForm = computed(() => !!this.backgroundStyle());
  readonly userLoginData = this.store.selectSignal(selectUserLoginData);

  readonly hasScrolledToBottom = signal(false);

  readonly model = signal<SecurityConsent>({ annualConsent: false });
  readonly form = form(
    this.model,
    (schema) => {
      disabled(schema.annualConsent, () => !this.hasScrolledToBottom());
    },
    {
      submission: {
        action: async () => {
          if (!this.hasScrolledToBottom()) return;
          const updatedUserLoginData = {
            ...this.userLoginData(),
            security_consent_version: SECURITY_CONSENT_VERSION,
          };

          updatedUserLoginData.consent_for_one_year = this.form.annualConsent().value();

          const retval = await this.usersService.updateCurrentUser(updatedUserLoginData);
          this.store.dispatch(
            userLoginDataUpdatedAction({
              payload: {
                ...retval,
                security_consent_version_at_login: SECURITY_CONSENT_VERSION,
              },
            }),
          );
          this.router.navigate(['/select-committee']);
        },
      },
    },
  );
  readonly componentToLoad = environment.name === 'test' ? DevNoticeComponent : ProdNoticeComponent;

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    if (!element) return;

    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 5;

    if (isAtBottom && !this.hasScrolledToBottom()) {
      this.hasScrolledToBottom.set(true);
    }
  }
}
