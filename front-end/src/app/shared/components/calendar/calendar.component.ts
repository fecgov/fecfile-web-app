import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { DestroyerComponent } from '../app-destroyer.component';
import { DateUtils } from 'app/shared/utils/date.utils';
import { DatePicker } from 'primeng/datepicker';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  imports: [DatePicker, ReactiveFormsModule, ErrorMessagesComponent],
})
export class CalendarComponent extends DestroyerComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() formSubmitted = false;
  @Input() fieldName!: string;
  @Input() label!: string;
  @Input() showErrors = true;
  @Input() requiredErrorMessage = 'This is a required field.';

  calendarOpened = false;
  control!: SubscriptionFormControl<Date | null>;

  ngOnInit(): void {
    const originalControl = this.form?.get(this.fieldName) as SubscriptionFormControl;
    const date = DateUtils.parseDate(originalControl.value);
    this.control = originalControl.copy<Date | null>(date, 'submit');
    this.form.setControl(this.fieldName, this.control);
  }

  validateDate(calendarUpdate: boolean) {
    this.calendarOpened = calendarUpdate;
    if (!this.calendarOpened && this.control) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pendingValue = (this.control as any)._pendingValue;
      this.control.markAsTouched();
      this.control.setValue(pendingValue);
      this.control.updateValueAndValidity();
    }
  }
}
