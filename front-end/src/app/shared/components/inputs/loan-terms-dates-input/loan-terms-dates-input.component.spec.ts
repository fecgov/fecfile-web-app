import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { LoanTermsDatesInputComponent } from './loan-terms-dates-input.component';
import { SharedModule } from 'app/shared/shared.module';
import { percentageValidator } from 'app/shared/utils/validators.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

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
    component.form = new FormGroup(
      {
        loan_incurred_date: new SubscriptionFormControl(''),
        loan_interest_rate: new SubscriptionFormControl(''),
        loan_interest_rate_field_setting: new SubscriptionFormControl(''),
        loan_due_date: new SubscriptionFormControl(''),
        loan_due_date_field_setting: new SubscriptionFormControl(''),
      },
      { updateOn: 'blur' },
    );
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

  it('should handle interest_rate inputs correctly when clearValuesOnChange is true', () => {
    // Changing the interest rate setting to USER_DEFINED should clear the value
    component.interestRate = '12.3%';

    component.interestRateSetting = component.termFieldSettings.USER_DEFINED;
    expect(component.interestRate).toBe('');

    // While USER_DEFINED, non-percentage values should go unchanged
    component.interestRate = '12.3';
    expect(component.interestRate).toEqual('12.3');

    // Changing the interest rate setting to EXACT_PERCENTAGE should clear the value
    component.interestRateSetting = component.termFieldSettings.EXACT_PERCENTAGE;
    expect(component.interestRate).toBe('');

    // You should be unable to delete the % symbol
    component.interestRate = '12.3';
    expect(component.interestRate).toEqual('12.3%');

    // If the value would only be '%', clear the field
    component.interestRate = '%';
    expect(component.interestRate).toEqual('');

    // Changing back and forth between field settings should clear the value
    component.interestRate = '12.3%';
    component.interestRateSetting = component.termFieldSettings.USER_DEFINED;
    component.interestRateSetting = component.termFieldSettings.EXACT_PERCENTAGE;
    expect(component.interestRate).toBe('');
  });

  it('should handle interest_rate inputs correctly when clearValuesOnChange is false ', () => {
    component.clearValuesOnChange = false;

    // Changing the interest rate setting to USER_DEFINED should clear the value
    component.interestRate = '12.3%';
    component.interestRateSetting = component.termFieldSettings.USER_DEFINED;

    expect(component.interestRate).toBe('12.3%');

    // While USER_DEFINED, non-percentage values should go unchanged
    component.interestRate = '12.3';
    expect(component.interestRate).toEqual('12.3');

    // Changing the interest rate setting to EXACT_PERCENTAGE should clear the value
    component.interestRateSetting = component.termFieldSettings.EXACT_PERCENTAGE;
    expect(component.interestRate).toBe('12.3%');

    // You should be unable to delete the % symbol
    component.interestRate = '12.3';
    expect(component.interestRate).toEqual('12.3%');

    // If the value would only be '%', clear the field
    component.interestRate = '%';
    expect(component.interestRate).toEqual('');

    // Changing back and forth between field settings should clear the value
    component.interestRate = '12.3%';
    component.interestRateSetting = component.termFieldSettings.USER_DEFINED;
    component.interestRateSetting = component.termFieldSettings.EXACT_PERCENTAGE;
    expect(component.interestRate).toBe('12.3%');
  });

  it('should add and remove the percentage pattern validator', () => {
    component.interestRateSetting = component.termFieldSettings.USER_DEFINED;
    expect(component.interestRateField?.hasValidator(percentageValidator)).toBeFalse();
    component.interestRateSetting = component.termFieldSettings.EXACT_PERCENTAGE;
    expect(component.interestRateField?.hasValidator(percentageValidator)).toBeTrue();
  });

  it('should handle due_date inputs correctly when clearValuesOnChange is true', fakeAsync(() => {
    // Changing the due_date setting to USER_DEFINED should clear value
    component.dueDate = new Date('10/31/2010 00:00');
    component.dueDateSetting = component.termFieldSettings.USER_DEFINED;
    expect(component.dueDate as unknown as string).toBe('');

    // When changing to the SPECIFIC_DATE setting should clear value
    component.dueDateSetting = component.termFieldSettings.SPECIFIC_DATE;
    expect(component.dueDate).toBeNull();

    // When switch settings, it will fall back to clearing the date field
    component.dueDateSetting = component.termFieldSettings.USER_DEFINED;
    component.dueDate = 'A user-entered string';
    component.dueDateSetting = component.termFieldSettings.SPECIFIC_DATE;
    expect(component.dueDate).toBeNull();
    component.dueDate = 'Not a Date instance';
    component.dueDateSetting = component.termFieldSettings.USER_DEFINED;
    expect(component.dueDate).toEqual('');
  }));

  it('should handle due_date inputs correctly when clearValuesOnChange is false', fakeAsync(() => {
    component.clearValuesOnChange = false;
    // Changing the due_date setting to USER_DEFINED should clear value
    component.dueDate = new Date('10/31/2010 00:00');
    component.dueDateSetting = component.termFieldSettings.USER_DEFINED;
    expect(component.dueDate as unknown as string).toBe('2010-10-31');

    // When changing to the SPECIFIC_DATE setting should clear value
    component.dueDateSetting = component.termFieldSettings.SPECIFIC_DATE;
    expect(component.dueDate instanceof Date).toBeTrue();

    // When switch settings, it will fall back to clearing the date field
    component.dueDateSetting = component.termFieldSettings.USER_DEFINED;
    component.dueDate = 'A user-entered string';
    component.dueDateSetting = component.termFieldSettings.SPECIFIC_DATE;
    expect(component.dueDate).toBeNull();
    component.dueDate = 'Not a Date instance';
    component.dueDateSetting = component.termFieldSettings.USER_DEFINED;
    expect(component.dueDate).toEqual('Not a Date instance');
  }));
});
