import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './calendar.component';
import { DatePickerModule } from 'primeng/datepicker';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { ScheduleATransactionTypes } from 'app/shared/models';
import { Component, inject, viewChild } from '@angular/core';
import { value } from '@primeuix/themes/aura/knob';

@Component({
  imports: [CalendarComponent],
  standalone: true,
  providers: [FormBuilder],
  template: `<app-calendar [form]="form" [formSubmitted]="formSubmitted" [fieldName]="fieldName" [label]="label" />`,
})
class TestHostComponent {
  readonly fb = inject(FormBuilder);
  transaction = getTestTransactionByType(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT);
  form: FormGroup = this.fb.group(
    SchemaUtils.getFormGroupFieldsNoBlur(
      this.transaction.transactionType.getFormControlNames(),
      this.transaction.transactionType.schema,
    ),
    { updateOn: 'blur' },
  );
  formSubmitted = false;
  fieldName = 'contribution_date';
  label = 'Test Date';

  component = viewChild.required(CalendarComponent);
}

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatePickerModule, CalendarComponent],
      providers: [FormBuilder],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form control with "submit" update strategy', () => {
    expect(component.control()!.updateOn).toBe('blur');
  });

  it('should toggle calendarOpened on validateDate', () => {
    component.validateDate(true);
    expect(component.calendarOpened).toBe(true);

    component.validateDate(false);
    expect(component.calendarOpened).toBe(false);
  });

  it('should mark control as touched and update value on updateValue', () => {
    const dateString = '01/01/2020';
    const expectedDate = new Date(dateString);

    vi.spyOn(document, 'getElementById').mockReturnValue({
      value: dateString,
    } as unknown as HTMLInputElement);

    component.validateDate(false);

    expect(component.control()!.touched).toBe(true);
    expect(component.control()!.value).toEqual(expectedDate);
  });
});
