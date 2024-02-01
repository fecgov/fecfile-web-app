import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { UsersService } from 'app/shared/services/users.service';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { map, takeUntil } from 'rxjs';
import { UserLoginData } from '../../shared/models/user.model';

@Component({
  selector: 'app-update-current-user',
  templateUrl: './update-current-user.component.html',
  styleUrls: ['./update-current-user.component.scss'],
})
export class UpdateCurrentUserComponent extends DestroyerComponent implements OnInit {
  form: FormGroup = this.fb.group({});

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private usersService: UsersService) {
    super();
  }

  ngOnInit(): void {
    this.store.select(selectUserLoginData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((userLoginData: UserLoginData) => {
        this.form.setControl('last_name', new FormControl(
          userLoginData.last_name, Validators.required));
        this.form.setControl('first_name', new FormControl(
          userLoginData.last_name, Validators.required));
        this.form.setControl('email', new FormControl(
          userLoginData.email, Validators.required));
      });
  }

  continue() {
    if (this.form.invalid) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }

    const updatedUserLoginData: UserLoginData = {
      first_name: this.form.get('first_name')?.value(),
      last_name: this.form.get('last_name')?.value(),
      email: this.form.get('email')?.value()
    }
    this.usersService.updateCurrentUser(updatedUserLoginData).pipe(
      map(() => {
        this.router.navigate(['dashboard']);
      })
    );
  }

  cancel() {
    this.router.navigate(['/']);
  }

}
