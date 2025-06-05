import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-select',
  imports: [SelectModule, ReactiveFormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent {
  readonly inputId = input.required<string>();
  readonly label = input.required<string>();
  readonly options = input.required<PrimeOptions>();
  readonly control = input.required<SubscriptionFormControl>();
  readonly labelClass = input<string>('');
}
