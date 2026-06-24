import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { SearchableSelectComponent } from '../../searchable-select/searchable-select.component';

@Component({
  selector: 'app-select-input',
  imports: [FormField, SearchableSelectComponent],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss',
})
export class SelectInputComponent {
  readonly label = input.required<string>();
  readonly id = input.required<string>();
  readonly field = input.required<FieldTree<string, string>>();
  readonly options = input.required<PrimeOptions>();
  readonly searchable = input(false);
  readonly fieldState = computed(() => this.field()());
}
