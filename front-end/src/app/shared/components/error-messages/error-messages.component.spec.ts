import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorMessagesComponent } from './error-messages.component';
import { Injector, LOCALE_ID, Component } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';

describe('ErrorMessagesComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let control: SignalFormControl;

  @Component({
    selector: 'test-host',
    template: `<app-error-messages
      [control]="control"
      [formSubmitted]="true"
      [emailErrorMessage]="emailError"
    ></app-error-messages>`,
    standalone: true,
    imports: [ErrorMessagesComponent],
  })
  class TestHostComponent {
    control!: SignalFormControl;
    emailError = '';
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'en-US' }],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;

    const injector = TestBed.inject(Injector);
    control = new SignalFormControl(injector, null);
    hostComponent.control = control;
  });

  function setErrors(errors: any) {
    control.setErrors(errors);
    fixture.detectChanges();
  }

  it('should show default required message', () => {
    setErrors({ required: true });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('This is a required field.');
  });

  it('should show custom email error message if provided', () => {
    hostComponent.emailError = 'Custom email problem';
    setErrors({ email: 'whatever' });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Custom email problem');
  });

  it('should fall back to email "not-unique" error message', () => {
    hostComponent.emailError = '';
    setErrors({ email: 'not-unique' });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Confirmation emails cannot be identical');
  });

  it('should compute exclusiveMin = 0 as negative message', () => {
    setErrors({ exclusiveMin: { exclusiveMin: 0 } });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Amount must be negative');
  });

  it('should compute default min error message with value', () => {
    setErrors({ min: { min: 123 } });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain(`greater than or equal to ${formatCurrency(123, 'en-US', '$')}`);
  });
});
