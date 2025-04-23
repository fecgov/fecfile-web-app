import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { DatePicker } from 'primeng/datepicker';
import { DateUtils } from 'app/shared/utils/date.utils';
import { createSignal } from '@angular/core/primitives/signals';

// Mock child component
@Component({
  selector: 'app-error-messages',
  template: '',
})
class MockErrorMessagesComponent {
  @Input() control!: SignalFormControl<Date | null>;
  @Input() formSubmitted!: boolean;
  @Input() requiredErrorMessage!: string;
}

fdescribe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let form: FormGroup;
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('2020-01-01');
    form = new FormGroup({
      myDate: control,
    });

    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule],
      declarations: [CalendarComponent, MockErrorMessagesComponent, DatePicker],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;

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

  it('should bind the formControl to the p-datepicker', () => {
    const datepicker = fixture.nativeElement.querySelector('p-datepicker');
    expect(datepicker).toBeTruthy();
    expect(datepicker.getAttribute('formcontrol')).toBeTruthy(); // basic sanity check
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
