import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { LoanTermsInputComponent } from './loan-terms-input.component';

import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { createSignal } from '@angular/core/primitives/signals';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { Injector } from '@angular/core';

describe('LoanTermsInputComponent', () => {
  let component: LoanTermsInputComponent;
  let fixture: ComponentFixture<LoanTermsInputComponent>;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoanTermsInputComponent],
      providers: [provideMockStore(testMockStore)],
    });
    injector = TestBed.inject(Injector);
    fixture = TestBed.createComponent(LoanTermsInputComponent);
    component = fixture.componentInstance;
    (component.templateMap as any) = createSignal(testTemplateMap);
    (component.form as any) = createSignal(
      new FormGroup(
        {
          loan_incurred_date: new SignalFormControl(injector, ''),
          loan_interest_rate: new SignalFormControl(injector, ''),
          loan_due_date: new SignalFormControl(injector, ''),
          collateral: new SignalFormControl(injector, ''),
        },
        { updateOn: 'blur' },
      ),
    );
    (component.templateMap as any) = createSignal({
      ...testTemplateMap,
      ...{
        interest_rate: 'loan_interest_rate',
        date: 'loan_incurred_date',
        due_date: 'loan_due_date',
        secured: 'collateral',
      },
    });
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
