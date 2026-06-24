import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { PrimeOptions } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-radio-input',
  imports: [FormField],
  templateUrl: './radio-input.component.html',
  styleUrl: './radio-input.component.scss',
})
export class RadioInputComponent {
  readonly field = input.required<FieldTree<string, string>>();
  readonly label = input.required<string>();
  readonly options = input.required<PrimeOptions>();
}
