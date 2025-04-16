import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { LoanTermsInputComponent } from './loan-terms-input.component';

import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { SubscriptionFormControl } from 'app/shared/utils/signal-form-control';

describe('LoanTermsInputComponent', () => {
  let component: LoanTermsInputComponent;
  let fixture: ComponentFixture<LoanTermsInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoanTermsInputComponent],
      providers: [provideMockStore(testMockStore)],
    });
    fixture = TestBed.createComponent(LoanTermsInputComponent);
    component = fixture.componentInstance;
    component.templateMap = testTemplateMap;
    component.form = new FormGroup(
      {
        loan_incurred_date: new SubscriptionFormControl(''),
        loan_interest_rate: new SubscriptionFormControl(''),
        loan_due_date: new SubscriptionFormControl(''),
        collateral: new SubscriptionFormControl(''),
      },
      { updateOn: 'blur' },
    );
    component.templateMap = {
      ...testTemplateMap,
      ...{
        interest_rate: 'loan_interest_rate',
        date: 'loan_incurred_date',
        due_date: 'loan_due_date',
        secured: 'collateral',
      },
    };
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
