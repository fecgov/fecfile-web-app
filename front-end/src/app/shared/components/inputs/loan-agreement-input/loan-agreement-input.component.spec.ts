import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { LoanAgreementInputComponent } from './loan-agreement-input.component';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';

describe('LoanAgreementInputComponent', () => {
  let component: LoanAgreementInputComponent;
  let fixture: ComponentFixture<LoanAgreementInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [LoanAgreementInputComponent],
      providers: [provideMockStore(testMockStore)],
    });
    fixture = TestBed.createComponent(LoanAgreementInputComponent);
    component = fixture.componentInstance;

    // Set up component with form control
    const form = new FormGroup({
      lender_organization_name: new FormControl(),
      loan_interest_rate: new FormControl(),
      loan_interest_rate_field_setting: new FormControl(),
      loan_due_date: new FormControl(),
      loan_due_date_field_setting: new FormControl(),
      collateral: new FormControl(),
      ind_name_account_location: new FormControl(),
      account_street_1: new FormControl(),
      account_street_2: new FormControl(),
      account_city: new FormControl(),
      account_state: new FormControl(),
      account_zip: new FormControl(),
      treasurer_last_name: new FormControl(),
      treasurer_first_name: new FormControl(),
      treasurer_middle_name: new FormControl(),
      treasurer_prefix: new FormControl(),
      treasurer_suffix: new FormControl(),
      treasurer_date_signed: new FormControl(),
      authorized_last_name: new FormControl(),
      authorized_first_name: new FormControl(),
      authorized_middle_name: new FormControl(),
      authorized_prefix: new FormControl(),
      authorized_suffix: new FormControl(),
      authorized_title: new FormControl(),
      authorized_date_signed: new FormControl(),
      lender_street_1: new FormControl(),
      lender_street_2: new FormControl(),
      lender_city: new FormControl(),
      lender_state: new FormControl(),
      lender_zip: new FormControl(),
      loan_incurred_date: new FormControl(),
      loan_amount: new FormControl(),
      total_balance: new FormControl(),
      loan_restructured: new FormControl(),
      loan_originally_incurred_date: new FormControl(),
      credit_amount_this_draw: new FormControl(),
      others_liable: new FormControl(),
      desc_collateral: new FormControl(),
      collateral_value_amount: new FormControl(),
      perfected_interest: new FormControl(),
      future_income: new FormControl(),
      desc_specification_of_the_above: new FormControl(),
      estimated_value: new FormControl(),
      depository_account_established_date: new FormControl(),
      basis_of_loan_description: new FormControl(),
      line_of_credit: new FormControl(),
      entity_type: new FormControl(),
    });
    component.form = form;
    component.templateMap = {
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
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
