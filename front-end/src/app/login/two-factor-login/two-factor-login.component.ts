import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-two-factor-login',
  templateUrl: './two-factor-login.component.html',
  styleUrls: ['./two-factor-login.component.scss'],
})
export class TwoFactorLoginComponent {
  twoFactInfo: FormGroup = this.fb.group({
    twoFactOption: ['', Validators.required],
  });

  constructor(private router: Router, private fb: FormBuilder) {}

  back() {
    // destroy current session if any and return to login page
    this.router.navigate(['/login']);
  }

  submit() {
    this.twoFactInfo.markAsTouched();

    if (this.twoFactInfo.valid) {
      this.router.navigate(['/confirm-2f']);
    }
  }
}
