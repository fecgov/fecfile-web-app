import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { LoanInfoInputComponent } from './loan-info-input.component';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { SubscriptionFormControl } from 'app/shared/utils/signal-form-control';

describe('LoanInfoInputComponent', () => {
  let component: LoanInfoInputComponent;
  let fixture: ComponentFixture<LoanInfoInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoanInfoInputComponent],
      providers: [provideMockStore(testMockStore)],
    });
    fixture = TestBed.createComponent(LoanInfoInputComponent);
    component = fixture.componentInstance;

    // Set up component with form control
    const form = new FormGroup(
      {
        loan_amount: new SubscriptionFormControl(),
        total_balance: new SubscriptionFormControl(),
        loan_payment_to_date: new SubscriptionFormControl(),
        memo_code: new SubscriptionFormControl(),
      },
      { updateOn: 'blur' },
    );
    component.form = form;
    component.templateMap = {
      ...testTemplateMap,
      ...{
        amount: 'loan_amount',
        balance: 'total_balance',
        payment_to_date: 'loan_payment_to_date',
        memo_code: 'memo_code',
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
