import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtInputComponent } from './debt-input.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { createSignal } from '@angular/core/primitives/signals';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { Injector } from '@angular/core';

describe('DebtInputComponent', () => {
  let component: DebtInputComponent;
  let fixture: ComponentFixture<DebtInputComponent>;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DebtInputComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideMockStore(testMockStore)],
    });
    fixture = TestBed.createComponent(DebtInputComponent);
    injector = TestBed.inject(Injector);
    component = fixture.componentInstance;
    (component.templateMap as any) = createSignal(testTemplateMap);
    component.form().setControl('loan_balance', new SignalFormControl(injector));
    component.form().setControl('contribution_amount', new SignalFormControl(injector));
    component.form().setControl('payment_amount', new SignalFormControl(injector));
    component.form().setControl('balance_at_close', new SignalFormControl(injector));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
