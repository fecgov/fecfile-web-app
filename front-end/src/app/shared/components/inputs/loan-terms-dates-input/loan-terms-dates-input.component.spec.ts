/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { LoanTermsDatesInputComponent } from './loan-terms-dates-input.component';

import { percentageValidator } from 'app/shared/utils/validators.utils';
import { createSignal } from '@angular/core/primitives/signals';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { Injector } from '@angular/core';

describe('LoanTermsDatesInputComponent', () => {
  let component: LoanTermsDatesInputComponent;
  let fixture: ComponentFixture<LoanTermsDatesInputComponent>;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoanTermsDatesInputComponent],
      providers: [provideMockStore(testMockStore)],
    });
    injector = TestBed.inject(Injector);
    fixture = TestBed.createComponent(LoanTermsDatesInputComponent);
    component = fixture.componentInstance;
    (component.templateMap as any) = createSignal(testTemplateMap);
    (component.form as any) = createSignal(
      new FormGroup(
        {
          loan_incurred_date: new SignalFormControl(injector, ''),
          loan_interest_rate: new SignalFormControl(injector, ''),
          loan_interest_rate_field_setting: new SignalFormControl(injector, ''),
          loan_due_date: new SignalFormControl(injector, ''),
          loan_due_date_field_setting: new SignalFormControl(injector, ''),
        },
        { updateOn: 'blur' },
      ),
    );
    (component.templateMap as any) = createSignal({
      ...testTemplateMap,
      ...{
        interest_rate: 'loan_interest_rate',
        interest_rate_setting: 'loan_interest_rate_field_setting',
        date: 'loan_incurred_date',
        due_date: 'loan_due_date',
        due_date_setting: 'loan_due_date_field_setting',
      },
    });
    fixture.detectChanges();
  });

  function testInterest(value: string, expectedValue: string, startSetting: string, toggleSetting?: string): void {
    if (component.interestRateSetting !== startSetting) component.interestRateSetting = startSetting;
    component.interestRate = value;
    if (toggleSetting && startSetting !== toggleSetting) component.interestRateSetting = toggleSetting;
    expect(component.interestRate).toBe(expectedValue);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid INCURRED DATE input if outside the report date range', () => {
    const control = component.form().get(component.templateMap().date);
    expect(control?.status).toBe('INVALID');
    control?.setValue(new Date('January 1, 2015 00:00:00'));
    expect(control?.status).toBe('INVALID');
    control?.setValue(new Date('June 1, 2022 00:00:00'));
    expect(control?.status).toBe('VALID');
  });

  it('should handle interest_rate inputs correctly when clearValuesOnChange is true', () => {
    // Changing the interest rate setting to USER_DEFINED should clear the value
    testInterest('12.3%', '', component.termFieldSettings.EXACT_PERCENTAGE, component.termFieldSettings.USER_DEFINED);
    // While USER_DEFINED, non-percentage values should go unchanged
    testInterest('12.3', '12.3', component.termFieldSettings.USER_DEFINED);
    // Changing the interest rate setting to EXACT_PERCENTAGE should clear the value
    testInterest('12.3', '', component.termFieldSettings.USER_DEFINED, component.termFieldSettings.EXACT_PERCENTAGE);
    // You should be unable to delete the % symbol on EXACT_PERCENTAGE
    testInterest('12.3', '12.3%', component.termFieldSettings.EXACT_PERCENTAGE);
    // If the value would only be '%', clear the field
    testInterest('%', '', component.termFieldSettings.EXACT_PERCENTAGE);
  });

  it('should handle interest_rate inputs correctly when clearValuesOnChange is false ', () => {
    component.clearValuesOnChange = false;

    // Changing the interest rate setting to USER_DEFINED should NOT clear the value
    testInterest(
      '12.3%',
      '12.3%',
      component.termFieldSettings.EXACT_PERCENTAGE,
      component.termFieldSettings.USER_DEFINED,
    );

    // While USER_DEFINED, non-percentage values should go unchanged
    testInterest('12.3', '12.3', component.termFieldSettings.USER_DEFINED);

    // Changing the interest rate setting to EXACT_PERCENTAGE should NOT clear the value and add %
    testInterest(
      '12.3',
      '12.3%',
      component.termFieldSettings.USER_DEFINED,
      component.termFieldSettings.EXACT_PERCENTAGE,
    );

    // Changing back and forth between field settings should NOT clear the value
    component.interestRateSetting = component.termFieldSettings.EXACT_PERCENTAGE;
    component.interestRate = '12.3%';
    component.interestRateSetting = component.termFieldSettings.USER_DEFINED;
    component.interestRateSetting = component.termFieldSettings.EXACT_PERCENTAGE;
    expect(component.interestRate).toBe('12.3%');
  });

  it('should add and remove the percentage pattern validator', () => {
    component.interestRateSetting = component.termFieldSettings.USER_DEFINED;
    expect(component.interestRateField()?.hasValidator(percentageValidator)).toBeFalse();
    component.interestRateSetting = component.termFieldSettings.EXACT_PERCENTAGE;
    expect(component.interestRateField()?.hasValidator(percentageValidator)).toBeTrue();
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
