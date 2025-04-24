/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { LoanInfoInputComponent } from './loan-info-input.component';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { Injector } from '@angular/core';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { createSignal } from '@angular/core/primitives/signals';

describe('LoanInfoInputComponent', () => {
  let component: LoanInfoInputComponent;
  let fixture: ComponentFixture<LoanInfoInputComponent>;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoanInfoInputComponent],
      providers: [provideMockStore(testMockStore)],
    });
    injector = TestBed.inject(Injector);
    fixture = TestBed.createComponent(LoanInfoInputComponent);
    component = fixture.componentInstance;

    // Set up component with form control
    const form = new FormGroup(
      {
        loan_amount: new SignalFormControl(injector),
        total_balance: new SignalFormControl(injector),
        loan_payment_to_date: new SignalFormControl(injector),
        memo_code: new SignalFormControl(injector),
      },
      { updateOn: 'blur' },
    );
    (component.form as any) = createSignal(form);
    (component.templateMap as any) = createSignal({
      ...testTemplateMap,
      ...{
        amount: 'loan_amount',
        balance: 'total_balance',
        payment_to_date: 'loan_payment_to_date',
        memo_code: 'memo_code',
      },
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
