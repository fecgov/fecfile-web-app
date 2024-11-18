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

  it('should handle interest_rate inputs correctly', () => {
    const settingField = component.form.get(component.templateMap.interest_rate_setting);
    const rateField = component.form.get(component.templateMap.interest_rate);

    // Changing the interest rate setting to USER_DEFINED should clear the value
    rateField?.setValue('12.3%');
    settingField?.setValue(component.termFieldSettings.USER_DEFINED);
    expect(rateField?.value).toBeNull();

    // While USER_DEFINED, non-percentage values should go unchanged
    rateField?.setValue('12.3');
    expect(rateField?.value).toEqual('12.3');

    // Changing the interest rate setting to EXACT_PERCENTAGE should clear the value
    settingField?.setValue(component.termFieldSettings.EXACT_PERCENTAGE);
    expect(rateField?.value).toBeNull();

    // You should be unable to delete the % symbol
    rateField?.setValue('12.3');
    expect(rateField?.value).toEqual('12.3%');

    // If the value would only be '%', clear the field
    rateField?.setValue('%');
    expect(rateField?.value).toEqual('');

    // Changing back and forth between field settings should clear the value
    rateField?.setValue('12.3%');
    settingField?.setValue(component.termFieldSettings.USER_DEFINED);
    settingField?.setValue(component.termFieldSettings.EXACT_PERCENTAGE);
    expect(rateField?.value).toBeNull();
  });

  it('should add and remove the percentage pattern validator', () => {
    const settingField = component.form.get(component.templateMap.interest_rate_setting);
    const rateField = component.form.get(component.templateMap.interest_rate);
    settingField?.setValue(component.termFieldSettings.USER_DEFINED);
    expect(rateField?.hasValidator(percentageValidator)).toBeFalse();
    settingField?.setValue(component.termFieldSettings.EXACT_PERCENTAGE);
    expect(rateField?.hasValidator(percentageValidator)).toBeTrue();
  });

  it('should handle due_date inputs correctly', fakeAsync(() => {
    const settingField = component.form.get(component.templateMap.due_date_setting);
    let dateField = component.form.get(component.templateMap.due_date);

    // Changing the due_date setting to USER_DEFINED should clear value
    dateField?.setValue(new Date('10/31/2010 00:00'));
    settingField?.setValue(component.termFieldSettings.USER_DEFINED);
    dateField = component.form.get(component.templateMap.due_date);
    expect(dateField?.value).toBe('');

    // When changing to the SPECIFIC_DATE setting should clear value
    settingField?.setValue(component.termFieldSettings.SPECIFIC_DATE);
    dateField = component.form.get(component.templateMap.due_date);
    expect(dateField?.value).toBeNull();

    // When switch settings, it will fall back to clearing the date field
    settingField?.setValue(component.termFieldSettings.USER_DEFINED);
    dateField = component.form.get(component.templateMap.due_date);
    dateField?.setValue('A user-entered string');
    settingField?.setValue(component.termFieldSettings.SPECIFIC_DATE);
    fixture.detectChanges();
    dateField = component.form.get(component.templateMap.due_date);
    expect(dateField?.value).toBeNull();
    dateField?.setValue('Not a Date instance');
    settingField?.setValue(component.termFieldSettings.USER_DEFINED);
    dateField = component.form.get(component.templateMap.due_date);
    expect(dateField?.value).toEqual('');
  }));
});
