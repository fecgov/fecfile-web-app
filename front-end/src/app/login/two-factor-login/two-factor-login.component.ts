import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-two-factor-login',
  templateUrl: './two-factor-login.component.html',
  styleUrls: ['./two-factor-login.component.scss'],
})
export class TwoFactorLoginComponent {
  twoFactInfo!: FormGroup;

  constructor(private router: Router, private _fb: FormBuilder) {
    this.twoFactInfo = _fb.group({
      twoFactOption: ['', Validators.required],
    });
  }

  back() {
    // destroy current session if any and return to login page
    this.router.navigate(['/login']).then((r) => {
      // do nothing=
    });
  }

  submit() {
    this.twoFactInfo.markAsTouched();

    const option = this.twoFactInfo.get('twoFactOption')?.value;

    if (this.twoFactInfo.valid) {
      this.router.navigate(['/confirm-2f']).then((r) => {
        // handle it
      });
    }
  }
}
