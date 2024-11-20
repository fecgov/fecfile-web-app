import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './calendar.component';
import { CalendarModule } from 'primeng/calendar';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let form: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarComponent],
      imports: [ReactiveFormsModule, CalendarModule], // Ensure ReactiveFormsModule is imported here
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    form = new FormGroup({
      dateField: new SubscriptionFormControl(),
    });
    component.form = form;
    component.fieldName = 'dateField';
    component.label = 'Test Date';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form control with "submit" update strategy', () => {
    component.ngOnInit();
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
