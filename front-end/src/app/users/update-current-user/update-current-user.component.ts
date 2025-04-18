import { Component, inject, signal } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormComponent } from 'app/shared/components/app-destroyer.component';
import { LoginService } from 'app/shared/services/login.service';
import { UsersService } from 'app/shared/services/users.service';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { userLoginDataUpdatedAction } from 'app/store/user-login-data.actions';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { Card } from 'primeng/card';
import { UserLoginData } from 'app/shared/models';
import { ErrorMessagesComponent } from 'app/shared/components/error-messages/error-messages.component';
import { SingleClickDirective } from 'app/shared/directives/single-click.directive';
import { ButtonModule } from 'primeng/button';
import { effectOnceIf } from 'ngxtension/effect-once-if';

@Component({
  selector: 'app-update-current-user',
  templateUrl: './update-current-user.component.html',
  styleUrls: ['./update-current-user.component.scss'],
  imports: [Card, ReactiveFormsModule, ErrorMessagesComponent, SingleClickDirective, ButtonModule],
})
export class UpdateCurrentUserComponent extends FormComponent {
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  private readonly loginService = inject(LoginService);
  private readonly userSignal = this.store.selectSignal(selectUserLoginData);
  form = signal<FormGroup>(this.fb.group({}, { updateOn: 'blur' }));

  constructor() {
    super();
    effectOnceIf(
      () => this.userSignal(),
      () => {
        this.form().setControl(
          'last_name',
          new SignalFormControl(this.injector, this.userSignal().last_name, Validators.required),
        );
        this.form().setControl(
          'first_name',
          new SignalFormControl(this.injector, this.userSignal().first_name, Validators.required),
        );
        this.form().setControl(
          'email',
          new SignalFormControl(this.injector, this.userSignal().email, Validators.required),
        );
        this.formSubmitted = false;
      },
    );
  }

  async continue() {
    this.formSubmitted = true;
    blurActiveInput(this.form());
    if (this.form().invalid) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }

    const updatedUserLoginData = {
      first_name: this.form().get('first_name')?.value,
      last_name: this.form().get('last_name')?.value,
      email: this.form().get('email')?.value,
    } as UserLoginData;
    const response = await this.usersService.updateCurrentUser(updatedUserLoginData);
    this.store.dispatch(userLoginDataUpdatedAction({ payload: response }));
    this.router.navigate(['dashboard']);
  }

  cancel() {
    this.loginService.logOut();
  }
}
