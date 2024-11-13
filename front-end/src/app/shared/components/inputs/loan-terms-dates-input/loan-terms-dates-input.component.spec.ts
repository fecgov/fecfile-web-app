import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { LoanTermsDatesInputComponent } from './loan-terms-dates-input.component';
import { SharedModule } from 'app/shared/shared.module';
import { percentageValidator } from 'app/shared/utils/validators.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';

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
        loan_incurred_date: new FormControl(''),
        loan_interest_rate: new FormControl(''),
        loan_interest_rate_field_setting: new FormControl(''),
        loan_due_date: new FormControl(''),
        loan_due_date_field_setting: new FormControl(''),
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

  it('should handle interest_rate inputs correctly', () => {
    const settingField = component.form.get(component.templateMap.interest_rate_setting);
    const rateField = component.form.get(component.templateMap.interest_rate);

    // Changing the interest rate setting to USER_DEFINED should not change the value
    rateField?.setValue('12.3%');
    settingField?.setValue(component.termFieldSettings.USER_DEFINED);
    expect(rateField?.value).toEqual('12.3%');

    // While USER_DEFINED, non-percentage values should go unchanged
    rateField?.setValue('12.3');
    expect(rateField?.value).toEqual('12.3');

    // Changing the interest rate setting to EXACT_PERCENTAGE should change the value
    settingField?.setValue(component.termFieldSettings.EXACT_PERCENTAGE);
    expect(rateField?.value).toEqual('12.3%');

    // You should be unable to delete the % symbol
    rateField?.setValue('12.3');
    expect(rateField?.value).toEqual('12.3%');

    // Inappropriate characters should be cleared from the value
    rateField?.setValue('1a2b.3');
    expect(rateField?.value).toEqual('12.3%');

    // If the value would only be '%', clear the field
    rateField?.setValue('%');
    expect(rateField?.value).toEqual('');

    // Changing back and forth between field settings shouldn't change the value
    rateField?.setValue('12.3%');
    settingField?.setValue(component.termFieldSettings.USER_DEFINED);
    settingField?.setValue(component.termFieldSettings.EXACT_PERCENTAGE);
    expect(rateField?.value).toEqual('12.3%');
  });

  it('should add and remove the percentage pattern validator', () => {
    const settingField = component.form.get(component.templateMap.interest_rate_setting);
    const rateField = component.form.get(component.templateMap.interest_rate);
    settingField?.setValue(component.termFieldSettings.USER_DEFINED);
    expect(rateField?.hasValidator(percentageValidator)).toBeFalse();
    settingField?.setValue(component.termFieldSettings.EXACT_PERCENTAGE);
    expect(rateField?.hasValidator(percentageValidator)).toBeTrue();
  });

  it('should handle due_date inputs correctly', () => {
    const settingField = component.form.get(component.templateMap.due_date_setting);
    const dateField = component.form.get(component.templateMap.due_date);

    // Changing the due_date setting to USER_DEFINED should change a date object
    // to its FECDate formatted value
    dateField?.setValue(new Date('10/31/2010 00:00'));
    settingField?.setValue(component.termFieldSettings.USER_DEFINED);
    expect(dateField?.value).toEqual('2010-10-31');

    // When changing to the SPECIFIC_DATE setting with an FECDate formatted value
    // the value should be converted to a Date instance
    settingField?.setValue(component.termFieldSettings.SPECIFIC_DATE);
    expect(dateField?.value instanceof Date).toBeTrue();

    // When switch settings, it will fall back to clearing the date field
    settingField?.setValue(component.termFieldSettings.USER_DEFINED);
    dateField?.setValue('A user-entered string');
    settingField?.setValue(component.termFieldSettings.SPECIFIC_DATE);
    expect(dateField?.value).toBeUndefined();
    dateField?.setValue('Not a Date instance');
    settingField?.setValue(component.termFieldSettings.USER_DEFINED);
    expect(dateField?.value).toBeUndefined();
  });

  it('should update calendarOpened and call SchemaUtils.onBlurValidation with correct arguments', () => {
    const formField = 'dateField';
    const calendarOpened = true;
    spyOn(SchemaUtils, 'onBlurValidation');
    component.validateDate(formField, calendarOpened);
    expect(component.calendarOpened).toBe(calendarOpened);
    expect(SchemaUtils.onBlurValidation).toHaveBeenCalledWith(component.form.get(formField), calendarOpened);
  });
});
