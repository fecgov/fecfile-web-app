/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { Injector } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { DatePickerModule } from 'primeng/datepicker';
import { DateUtils } from 'app/shared/utils/date.utils';
import { createSignal } from '@angular/core/primitives/signals';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let form: FormGroup;
  let control: SignalFormControl;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatePickerModule, CalendarComponent], // Ensure ReactiveFormsModule is imported here
      providers: [FormBuilder],
    }).compileComponents();

    injector = TestBed.inject(Injector);
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;

    control = new SignalFormControl(injector, '2020-01-01');
    form = new FormGroup({
      myDate: control,
    });

    // Inputs as signals
    (component as any).form = createSignal(form);
    (component as any).fieldName = createSignal('myDate');
    (component as any).label = createSignal('My Label');
    (component as any).formSubmitted = createSignal(false);
    (component as any).showErrors = createSignal(true);
    (component as any).requiredErrorMessage = createSignal('Required');

    fixture.detectChanges();
  });

  it('should parse the initial value and set it on init', () => {
    const parsedDate = DateUtils.parseDate('2020-01-01');
    expect(component.control().value).toEqual(parsedDate);
  });

  it('should mark control as touched and set pending value on validateDate()', () => {
    // Mock pending value
    (component.control() as any)._pendingValue = new Date(2021, 0, 1);
    spyOn(component.control(), 'markAsTouched').and.callThrough();
    spyOn(component.control(), 'setValue').and.callThrough();
    spyOn(component.control(), 'updateValueAndValidity').and.callThrough();

    component.validateDate();

    expect(component.control().markAsTouched).toHaveBeenCalled();
    expect(component.control().setValue).toHaveBeenCalledWith(new Date(2021, 0, 1));
    expect(component.control().updateValueAndValidity).toHaveBeenCalled();
  });

  it('should show the error component if showErrors is true', () => {
    const errorComponent = fixture.nativeElement.querySelector('app-error-messages');
    expect(errorComponent).toBeTruthy();
  });

  it('should not show the error component if showErrors is false', () => {
    (component as any).showErrors = createSignal(false);
    fixture.detectChanges();
    const errorComponent = fixture.nativeElement.querySelector('app-error-messages');
    expect(errorComponent).toBeFalsy();
  });
});
