import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { TwoFactorLoginComponent } from './two-factor-login.component';

describe('TwoFactorLoginComponent', () => {
  let component: TwoFactorLoginComponent;
  let fixture: ComponentFixture<TwoFactorLoginComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TwoFactorLoginComponent],
      providers: [FormBuilder, { provide: Router, useValue: routerSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFactorLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /login when back selected', () => {
    component.back();
    const navArgs = routerSpy.navigate.calls.mostRecent().args[0];
    expect(navArgs[0]).toBe('/login');
  });

  it('should navigate to /login when submit selected', () => {
    component.twoFactInfo.patchValue({
      twoFactOption: 'TEXT',
    });
    component.submit();
    const navArgs = routerSpy.navigate.calls.mostRecent().args[0];
    expect(navArgs[0]).toBe('/confirm-2f');
  });
});
