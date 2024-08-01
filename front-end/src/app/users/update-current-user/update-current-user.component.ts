import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { LoginService } from 'app/shared/services/login.service';
import { UsersService } from 'app/shared/services/users.service';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { userLoginDataUpdatedAction } from 'app/store/user-login-data.actions';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { map, takeUntil } from 'rxjs';
import { UserLoginData } from '../../shared/models/user.model';
import { blurActiveInput } from 'app/shared/utils/form.utils';

@Component({
  selector: 'app-update-current-user',
  templateUrl: './update-current-user.component.html',
  styleUrls: ['./update-current-user.component.scss'],
})
export class UpdateCurrentUserComponent extends DestroyerComponent implements OnInit {
  form: FormGroup = this.fb.group({});
  formSubmitted = false;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private usersService: UsersService,
    private loginService: LoginService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(selectUserLoginData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((userLoginData: UserLoginData) => {
        this.form.setControl('last_name', new FormControl(userLoginData.last_name, Validators.required));
        this.form.setControl('first_name', new FormControl(userLoginData.first_name, Validators.required));
        this.form.setControl('email', new FormControl(userLoginData.email, Validators.required));
        this.formSubmitted = false;
      });
  }

  continue() {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    if (this.form.invalid) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }

    const updatedUserLoginData = {
      first_name: this.form.get('first_name')?.value,
      last_name: this.form.get('last_name')?.value,
      email: this.form.get('email')?.value,
    } as UserLoginData;
    this.usersService
      .updateCurrentUser(updatedUserLoginData)
      .pipe(
        map((response) => {
          this.store.dispatch(userLoginDataUpdatedAction({ payload: response }));
          this.router.navigate(['dashboard']);
        }),
      )
      .subscribe();
  }

  cancel() {
    this.loginService.logOut();
  }
}
