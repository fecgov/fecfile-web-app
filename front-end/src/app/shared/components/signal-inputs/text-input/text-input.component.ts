import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { ToUpperDirective } from 'app/shared/directives/to-upper.directive';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-text-input',
  imports: [FormField, ToUpperDirective, InputText],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
})
export class TextInputComponent {
  readonly label = input.required<string>();
  readonly id = input.required<string>();
  readonly field = input.required<FieldTree<string, string>>();
  readonly forceUpper = input(false);
  readonly optional = input(false);
  readonly fieldState = computed(() => this.field()());
}
