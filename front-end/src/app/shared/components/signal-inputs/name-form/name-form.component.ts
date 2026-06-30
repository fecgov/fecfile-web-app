import { Component, computed, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { TextInputComponent } from '../text-input/text-input.component';

export interface NameFields {
  last_name: string;
  first_name: string;
  middle_name: string;
  prefix: string;
  suffix: string;
}

@Component({
  selector: 'app-name-form',
  imports: [TextInputComponent],
  templateUrl: './name-form.component.html',
  styleUrl: './name-form.component.scss',
})
export class NameFormComponent {
  readonly fields = input.required<FieldTree<NameFields, string>>();
  readonly prefix = input<string>();
  readonly lastNameLabel = computed(() => {
    const prefix = this.prefix();
    let label = 'LAST NAME';
    return prefix ? `${prefix} ${label}` : label;
  });
  readonly firstNameLabel = computed(() => {
    const prefix = this.prefix();
    let label = 'FIRST NAME';
    return prefix ? `${prefix} ${label}` : label;
  });
  readonly middleNameLabel = computed(() => {
    const prefix = this.prefix();
    let label = 'MIDDLE NAME';
    return prefix ? `${prefix} ${label}` : label;
  });
  readonly prefixLabel = computed(() => {
    const prefix = this.prefix();
    let label = 'PREFIX';
    return prefix ? `${prefix} ${label}` : label;
  });
  readonly suffixLabel = computed(() => {
    const prefix = this.prefix();
    let label = 'SUFFIX';
    return prefix ? `${prefix} ${label}` : label;
  });
}
