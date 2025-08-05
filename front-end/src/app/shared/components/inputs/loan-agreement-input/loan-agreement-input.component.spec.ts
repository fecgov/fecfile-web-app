import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { LoanAgreementInputComponent } from './loan-agreement-input.component';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

describe('LoanAgreementInputComponent', () => {
  let component: LoanAgreementInputComponent;
  let fixture: ComponentFixture<LoanAgreementInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoanAgreementInputComponent],
      providers: [provideMockStore(testMockStore())],
    });
    fixture = TestBed.createComponent(LoanAgreementInputComponent);
    component = fixture.componentInstance;

    // Set up component with form control
    const form = new FormGroup(
      {
        lender_organization_name: new SubscriptionFormControl(),
        loan_interest_rate: new SubscriptionFormControl(),
        loan_interest_rate_field_setting: new SubscriptionFormControl(),
        loan_due_date: new SubscriptionFormControl(),
        loan_due_date_field_setting: new SubscriptionFormControl(),
        collateral: new SubscriptionFormControl(),
        ind_name_account_location: new SubscriptionFormControl(),
        account_street_1: new SubscriptionFormControl(),
        account_street_2: new SubscriptionFormControl(),
        account_city: new SubscriptionFormControl(),
        account_state: new SubscriptionFormControl(),
        account_zip: new SubscriptionFormControl(),
        treasurer_last_name: new SubscriptionFormControl(),
        treasurer_first_name: new SubscriptionFormControl(),
        treasurer_middle_name: new SubscriptionFormControl(),
        treasurer_prefix: new SubscriptionFormControl(),
        treasurer_suffix: new SubscriptionFormControl(),
        treasurer_date_signed: new SubscriptionFormControl(),
        authorized_last_name: new SubscriptionFormControl(),
        authorized_first_name: new SubscriptionFormControl(),
        authorized_middle_name: new SubscriptionFormControl(),
        authorized_prefix: new SubscriptionFormControl(),
        authorized_suffix: new SubscriptionFormControl(),
        authorized_title: new SubscriptionFormControl(),
        authorized_date_signed: new SubscriptionFormControl(),
        lender_street_1: new SubscriptionFormControl(),
        lender_street_2: new SubscriptionFormControl(),
        lender_city: new SubscriptionFormControl(),
        lender_state: new SubscriptionFormControl(),
        lender_zip: new SubscriptionFormControl(),
        loan_incurred_date: new SubscriptionFormControl(),
        loan_amount: new SubscriptionFormControl(),
        total_balance: new SubscriptionFormControl(),
        loan_restructured: new SubscriptionFormControl(),
        loan_originally_incurred_date: new SubscriptionFormControl(),
        credit_amount_this_draw: new SubscriptionFormControl(),
        others_liable: new SubscriptionFormControl(),
        desc_collateral: new SubscriptionFormControl(),
        collateral_value_amount: new SubscriptionFormControl(),
        perfected_interest: new SubscriptionFormControl(),
        future_income: new SubscriptionFormControl(),
        desc_specification_of_the_above: new SubscriptionFormControl(),
        estimated_value: new SubscriptionFormControl(),
        depository_account_established_date: new SubscriptionFormControl(),
        basis_of_loan_description: new SubscriptionFormControl(),
        line_of_credit: new SubscriptionFormControl(),
        entity_type: new SubscriptionFormControl(),
      },
      { updateOn: 'blur' },
    );
    component.form = form;
    component.templateMap = {
      ...testTemplateMap(),
      ...{
        organization_name: 'lender_organization_name',
        interest_rate: 'loan_interest_rate',
        interest_rate_setting: 'loan_interest_rate_field_setting',
        due_date: 'loan_due_date',
        due_date_setting: 'loan_due_date_field_setting',
        secured: 'collateral',
        secondary_name: 'ind_name_account_location',
        secondary_street_1: 'account_street_1',
        secondary_street_2: 'account_street_2',
        secondary_city: 'account_city',
        secondary_state: 'account_state',
        secondary_zip: 'account_zip',
        signatory_1_last_name: 'treasurer_last_name',
        signatory_1_first_name: 'treasurer_first_name',
        signatory_1_middle_name: 'treasurer_middle_name',
        signatory_1_prefix: 'treasurer_prefix',
        signatory_1_suffix: 'treasurer_suffix',
        signatory_1_date: 'treasurer_date_signed',
        signatory_2_last_name: 'authorized_last_name',
        signatory_2_first_name: 'authorized_first_name',
        signatory_2_middle_name: 'authorized_middle_name',
        signatory_2_prefix: 'authorized_prefix',
        signatory_2_suffix: 'authorized_suffix',
        signatory_2_title: 'authorized_title',
        signatory_2_date: 'authorized_date_signed',
        street_1: 'lender_street_1',
        street_2: 'lender_street_2',
        city: 'lender_city',
        state: 'lender_state',
        zip: 'lender_zip',
        date: 'loan_incurred_date',
        amount: 'loan_amount',
        balance: 'total_balance',
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
