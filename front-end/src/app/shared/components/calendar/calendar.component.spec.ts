import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './calendar.component';
import { DatePickerModule } from 'primeng/datepicker';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { ScheduleATransactionTypes, Transaction } from 'app/shared/models';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let form: FormGroup;
  let transaction: Transaction;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatePickerModule, CalendarComponent], // Ensure ReactiveFormsModule is imported here
      providers: [FormBuilder],
    }).compileComponents();
    const fb = TestBed.inject(FormBuilder);
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    transaction = getTestTransactionByType(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT);

    form = fb.group(
      SchemaUtils.getFormGroupFieldsNoBlur(
        transaction.transactionType.getFormControlNames(),
        transaction.transactionType.schema,
      ),
      { updateOn: 'blur' },
    );
    component.form = form;
    component.fieldName = 'contribution_date';

    component.label = 'Test Date';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form control with "submit" update strategy', () => {
    expect(component.control.updateOn).toBe('submit');
  });

  it('should toggle calendarOpened on validateDate', () => {
    component.validateDate(true);
    expect(component.calendarOpened).toBeTrue();

    component.validateDate(false);
    expect(component.calendarOpened).toBeFalse();
  });

  it('should mark control as touched and update value on updateValue', () => {
    const date = new Date();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component.control as any)._pendingValue = date;
    component.validateDate(false);
    expect(component.control.touched).toBeTrue();
    expect(component.control.value).toBe(date);
  });
});
