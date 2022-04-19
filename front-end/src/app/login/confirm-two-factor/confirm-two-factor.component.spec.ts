import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { LoginService } from 'app/shared/services/login.service';
import { AuthService } from '../../shared/services/AuthService/auth.service';

import { ConfirmTwoFactorComponent } from './confirm-two-factor.component';

describe('ConfirmTwoFactorComponent', () => {
  let component: ConfirmTwoFactorComponent;
  let fixture: ComponentFixture<ConfirmTwoFactorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [ConfirmTwoFactorComponent],
      providers: [
        Router,
        FormBuilder,
        LoginService,
        AuthService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '24fkzrw3487943uf358lovd' } },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmTwoFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
