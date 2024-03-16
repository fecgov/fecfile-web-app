import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { committeeIdValidator, emailValidator } from 'app/shared/utils/validators.utils';
import { LoginService } from '../../shared/services/login.service';

@Component({
  selector: 'app-debug-login',
  templateUrl: './debug-login.component.html',
  styleUrls: ['./debug-login.component.scss'],
})
export class DebugLoginComponent {
  public form!: FormGroup;

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
  }

  /**
   * Signs a user in once form is filled in and submit button clicked.
   *
   */
  public doSignIn(): void {
    if (this.form.invalid) {
      return;
    }

    const committeeId: string = this.form.get('committeeId')?.value;
    const password: string = this.form.get('loginPassword')?.value;
    const email: string = this.form.get('emailId')?.value;

    this.loginService.logIn(email, committeeId, password).then(() => {
      this.router.navigate(['dashboard']);
    });
  }
}
