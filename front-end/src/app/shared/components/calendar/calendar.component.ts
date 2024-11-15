import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { DestroyerComponent } from '../app-destroyer.component';
import { DateUtils } from 'app/shared/utils/date.utils';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent extends DestroyerComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() formSubmitted = false;
  @Input() fieldName!: string;
  @Input() label!: string;

  calendarOpened = false;
  control!: SubscriptionFormControl;

  ngOnInit(): void {
    const originalControl = this.form?.get(this.fieldName) as SubscriptionFormControl;
    const date = DateUtils.parseDate(originalControl.value);
    this.control = new SubscriptionFormControl(date, {
      validators: originalControl.validator,
      asyncValidators: originalControl.asyncValidator,
      updateOn: 'submit',
    });

    if (originalControl.disabled) this.control.disable();
    originalControl.subscriptions.forEach((sub) => {
      this.control.addSubscription(sub, this.destroy$);
    });
    if (originalControl.touched) this.control.markAsTouched();
    if (originalControl.dirty) this.control.markAsDirty();
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
