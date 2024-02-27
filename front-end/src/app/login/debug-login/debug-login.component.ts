import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginService } from '../../shared/services/login.service';
import { committeeIdValidator, emailValidator } from 'app/shared/utils/validators.utils';

@Component({
  selector: 'app-debug-login',
  templateUrl: './debug-login.component.html',
  styleUrls: ['./debug-login.component.scss'],
})
export class DebugLoginComponent implements OnInit {
  public form!: FormGroup;
  public isBusy = false;
  public hasFailed = false;
  public committeeIdInputError = false;
  public passwordInputError = false;
  public loginEmailInputError = false;
  public appTitle: string | undefined;
  public titleF!: string;
  public titleR!: string;
  public show!: boolean;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      emailId: ['', [Validators.required, emailValidator]],
      committeeId: ['', [Validators.required, committeeIdValidator]],
      loginPassword: ['', Validators.required],
    });
    this.show = false;
  }

  ngOnInit() {
    this.appTitle = environment.appTitle;
    this.titleF = this.appTitle.substring(0, 3);
    this.titleR = this.appTitle.substring(3);
  }

  /**
   * Updates the form validation when fields have text entered.
   *
   */
  public updateStatus(): void {
    if (this.form.get('committeeId')?.valid) {
      this.committeeIdInputError = false;
    }

    if (this.form.get('loginPassword')?.valid) {
      this.passwordInputError = false;
    }

    if (this.form.get('emailId')?.valid) {
      this.loginEmailInputError = false;
    }
  }

  /**
   * Signs a user in once form is filled in and submit button clicked.
   *
   */
  public doSignIn(): void {
    if (this.form.invalid) {
      this.committeeIdInputError = !!this.form.get('committeeId')?.invalid;

      this.passwordInputError = !!this.form.get('loginPassword')?.invalid;

      this.loginEmailInputError = !!this.form.get('emailId')?.invalid;
      return;
    }

    this.isBusy = true;
    this.hasFailed = false;

    const committeeId: string = this.form.get('committeeId')?.value;
    const password: string = this.form.get('loginPassword')?.value;
    const email: string = this.form.get('emailId')?.value;

    this.loginService.logIn(email, committeeId, password).subscribe({
      next: () => {
        this.loginService.dispatchUserLoggedInFromCookies();
        this.router.navigate(['dashboard']);
      },
      error: () => {
        this.isBusy = false;
        this.hasFailed = true;
      },
    });
  }

  showPassword() {
    this.show = !this.show;
  }
}
