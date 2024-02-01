import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LoginService } from 'app/shared/services/login.service';

@Component({
  selector: 'app-security-notice',
  templateUrl: './security-notice.component.html',
  styleUrls: ['./security-notice.component.scss'],
})
export class SecurityNoticeComponent implements OnInit {
  public loginDotGovAuthUrl: string | undefined;
  public localLoginAvailable = false;

  form = new FormGroup({
    'security-consent': new FormControl(),
  });

  constructor(private store: Store, public loginService: LoginService) {}

  ngOnInit() {
    this.form.get('security-consent')?.addValidators(Validators.requiredTrue);
  }
}
