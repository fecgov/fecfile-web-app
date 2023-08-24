import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { LoanTermsDatesInputComponent } from './loan-terms-dates-input.component';
import { SharedModule } from 'app/shared/shared.module';

describe('LoanTermsDatesInputComponent', () => {
  let component: LoanTermsDatesInputComponent;
  let fixture: ComponentFixture<LoanTermsDatesInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [LoanTermsDatesInputComponent],
      providers: [provideMockStore(testMockStore)],
    });
    fixture = TestBed.createComponent(LoanTermsDatesInputComponent);
    component = fixture.componentInstance;
    component.templateMap = testTemplateMap;
    component.form = new FormGroup({
      loan_incurred_date: new FormControl(''),
      loan_interest_rate: new FormControl(''),
      loan_interest_rate_field_setting: new FormControl(''),
      loan_due_date: new FormControl(''),
      loan_due_date_field_setting: new FormControl(''),
    });
    component.templateMap = {
      ...testTemplateMap,
      ...{
        interest_rate: 'loan_interest_rate',
        interest_rate_setting: 'loan_interest_rate_field_setting',
        date: 'loan_incurred_date',
        due_date: 'loan_due_date',
        due_date_setting: 'loan_due_date_field_setting',
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid INCURRED DATE input if outside the report date range', () => {
    const control = component.form.get(component.templateMap.date);
    expect(control?.status).toBe('INVALID');
    control?.setValue(new Date('January 1, 2015 00:00:00'));
    expect(control?.status).toBe('INVALID');
    control?.setValue(new Date('June 1, 2022 00:00:00'));
    expect(control?.status).toBe('VALID');
  });

  it('should handle percentage inputs right', () => {
    const settingField = component.form.get(component.templateMap.interest_rate_setting);
    const rateField = component.form.get(component.templateMap.interest_rate);

    // Changing the interest rate setting to user_defined should not change the value
    rateField?.setValue('48%');
    settingField?.setValue(component.termFieldSettings.user_defined);
    expect(rateField?.value).toEqual('48%');

    // While user_defined, non-percentage values should go unchanged
    rateField?.setValue('48');
    expect(rateField?.value).toEqual('48');

    // Changing the interest rate setting to exact_percentage should change the value
    settingField?.setValue(component.termFieldSettings.exact_percentage);
    expect(rateField?.value).toEqual('48%');

    // You should be unable to delete the % symbol
    rateField?.setValue('48');
    expect(rateField?.value).toEqual('48%');

    // Inappropriate characters should be cleared from the value
    rateField?.setValue('4a8b');
    expect(rateField?.value).toEqual('48%');
  });
});
