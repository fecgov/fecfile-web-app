import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './calendar.component';
import { DatePickerModule } from 'primeng/datepicker';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { ScheduleATransactionTypes } from 'app/shared/models';
import { Component, inject, viewChild } from '@angular/core';

@Component({
  imports: [CalendarComponent, ReactiveFormsModule],
  standalone: true,
  providers: [FormBuilder],
  template: `
    <form [formGroup]="form" [class.ng-submitted]="formSubmitted">
      <app-calendar [formSubmitted]="formSubmitted" [formControlName]="fieldName" [label]="label" />
    </form>
  `,
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

  it('should increment the year and update the view when delta is 1', () => {
    const event = new Event('click');
    const datePicker = component.datePicker();
    const yearSpy = vi.spyOn(datePicker, 'incrementYear');
    const monthChangeSpy = vi.spyOn(datePicker.onMonthChange, 'emit');
    const monthCreateSpy = vi.spyOn(datePicker, 'createMonths');
    component.onYearChange(event, 1);

    expect(yearSpy).toHaveBeenCalled();
    expect(datePicker.isMonthNavigate).toBe(true);
    expect(monthChangeSpy).toHaveBeenCalledWith({
      month: datePicker.currentMonth + 1,
      year: datePicker.currentYear,
    });
    expect(monthCreateSpy).toHaveBeenCalled();
  });

  it('should decrement the year and update the view when delta is -1', () => {
    const event = new Event('click');
    const datePicker = component.datePicker();
    const yearSpy = vi.spyOn(datePicker, 'decrementYear');
    const monthCreateSpy = vi.spyOn(datePicker, 'createMonths');
    component.onYearChange(event, -1);

    expect(yearSpy).toHaveBeenCalled();
    expect(datePicker.isMonthNavigate).toBe(true);
    expect(monthCreateSpy).toHaveBeenCalled();
  });

  it('should prevent default and return early if datepicker is disabled', () => {
    const datePicker = component.datePicker();
    vi.spyOn(datePicker, '$disabled').mockResolvedValue(true);
    const yearSpy = vi.spyOn(datePicker, 'incrementYear');
    const event = new Event('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    component.onYearChange(event, 1);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(yearSpy).not.toHaveBeenCalled();
  });
});
