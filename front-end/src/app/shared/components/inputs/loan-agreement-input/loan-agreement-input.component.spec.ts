/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { LoanAgreementInputComponent } from './loan-agreement-input.component';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { Injector } from '@angular/core';
import { createSignal } from '@angular/core/primitives/signals';

describe('LoanAgreementInputComponent', () => {
  let component: LoanAgreementInputComponent;
  let fixture: ComponentFixture<LoanAgreementInputComponent>;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoanAgreementInputComponent],
      providers: [provideMockStore(testMockStore)],
    });
    fixture = TestBed.createComponent(LoanAgreementInputComponent);
    component = fixture.componentInstance;
    injector = TestBed.inject(Injector);

    // Set up component with form control
    const form = new FormGroup(
      {
        lender_organization_name: new SignalFormControl(injector),
        loan_interest_rate: new SignalFormControl(injector),
        loan_interest_rate_field_setting: new SignalFormControl(injector),
        loan_due_date: new SignalFormControl(injector),
        loan_due_date_field_setting: new SignalFormControl(injector),
        collateral: new SignalFormControl(injector),
        ind_name_account_location: new SignalFormControl(injector),
        account_street_1: new SignalFormControl(injector),
        account_street_2: new SignalFormControl(injector),
        account_city: new SignalFormControl(injector),
        account_state: new SignalFormControl(injector),
        account_zip: new SignalFormControl(injector),
        treasurer_last_name: new SignalFormControl(injector),
        treasurer_first_name: new SignalFormControl(injector),
        treasurer_middle_name: new SignalFormControl(injector),
        treasurer_prefix: new SignalFormControl(injector),
        treasurer_suffix: new SignalFormControl(injector),
        treasurer_date_signed: new SignalFormControl(injector),
        authorized_last_name: new SignalFormControl(injector),
        authorized_first_name: new SignalFormControl(injector),
        authorized_middle_name: new SignalFormControl(injector),
        authorized_prefix: new SignalFormControl(injector),
        authorized_suffix: new SignalFormControl(injector),
        authorized_title: new SignalFormControl(injector),
        authorized_date_signed: new SignalFormControl(injector),
        lender_street_1: new SignalFormControl(injector),
        lender_street_2: new SignalFormControl(injector),
        lender_city: new SignalFormControl(injector),
        lender_state: new SignalFormControl(injector),
        lender_zip: new SignalFormControl(injector),
        loan_incurred_date: new SignalFormControl(injector),
        loan_amount: new SignalFormControl(injector),
        total_balance: new SignalFormControl(injector),
        loan_restructured: new SignalFormControl(injector),
        loan_originally_incurred_date: new SignalFormControl(injector),
        credit_amount_this_draw: new SignalFormControl(injector),
        others_liable: new SignalFormControl(injector),
        desc_collateral: new SignalFormControl(injector),
        collateral_value_amount: new SignalFormControl(injector),
        perfected_interest: new SignalFormControl(injector),
        future_income: new SignalFormControl(injector),
        desc_specification_of_the_above: new SignalFormControl(injector),
        estimated_value: new SignalFormControl(injector),
        depository_account_established_date: new SignalFormControl(injector),
        basis_of_loan_description: new SignalFormControl(injector),
        line_of_credit: new SignalFormControl(injector),
        entity_type: new SignalFormControl(injector),
      },
      { updateOn: 'blur' },
    );
    (component.form as any) = createSignal(form);
    (component.templateMap as any) = createSignal({
      ...testTemplateMap,
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
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
