import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'app/shared/services/login.service';
import { AuthService } from '../../shared/services/AuthService/auth.service';

@Component({
  selector: 'app-confirm-two-factor',
  templateUrl: './confirm-two-factor.component.html',
  styleUrls: ['./confirm-two-factor.component.scss'],
})
export class ConfirmTwoFactorComponent implements OnInit {
  public readonly ACCOUNT_LOCKED_MSG =
    'Account is locked. Please try again after 15 mins or call IT support to unlock account.';
  twoFactInfo!: FormGroup;
  option!: string;

  resendOption!: string;
  isValid = true;
  entryPoint!: string;
  contactData!: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  isAccountLocked!: boolean;
  private subscription!: Subscription;
  private response!: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private authService: AuthService
  ) {
    this.twoFactInfo = fb.group({
      securityCode: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });
  }

  ngOnInit() {
    this.isAccountLocked = false;
  }
  onDestroy() {
    this.subscription.unsubscribe();
  }

  back() {
    this.router.navigate(['/login']).then(() => {
      // do nothing
    });
  }

  /**
   * Verify 2 factor security code
   * if allowed ask for consent to login to FEC online system
   * and set the token to be used for further API calls
   * On account lock navigate to login screen
   */
  next() {
    // verify if the code is correct and show consent window
    // if not correct show error to the user
    this.twoFactInfo.markAsTouched();
    if (this.twoFactInfo.valid) {
      const code = this.twoFactInfo.get('securityCode')?.value;
      // prettier-ignore
      this.loginService.validateCode(code).subscribe((res: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (res) {
          this.response = res;
          const isAllowed = res['is_allowed'];
          if (isAllowed === true || isAllowed === 'true') {
            this.isValid = isAllowed;
          } else {
            this.isValid = false;
            this.handleAccountLock(res);
            return;
          }
          this.isValid = true;
          this.askConsent();
        } else {
          this.isValid = false;
        }
      });
    }
  }
  /**
   * In the case of account lock sign-out the current session nd navigate to HomePage
   * @param response
   * @private
   */
  // prettier-ignore
  private handleAccountLock(response: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    this.isAccountLocked = false;
    if (response['msg'] === this.ACCOUNT_LOCKED_MSG) {
      this.isAccountLocked = true;
      setTimeout(() => {
        this.authService.doSignOut();
        this.router.navigate(['/login']).then(() => {
          // do nothing
        });
      }, 5000);
    }
  }

  /**
   * After successful two factor code verification ask for consent
   * If accepted navigate to dashboard else sign-out and navigate to HomePAge
   * @private
   */
  private askConsent() {
    this.authService.doSignIn(this.response.token);
    this.router.navigate(['/dashboard']).then(() => {
      // do nothing
    });
  }

  public selectAnotherType() {
    if (this.entryPoint === 'login') {
      this.router.navigate(['/twoFactLogin']);
    } else if (this.entryPoint === 'registration') {
      this.router.navigate(['/register'], {
        queryParams: { register_token: this.activatedRoute.snapshot.queryParams['register_token'] },
      });
    } else if (this.entryPoint === 'reset') {
      this.router.navigate(['/reset-selector']);
    }
  }
}
