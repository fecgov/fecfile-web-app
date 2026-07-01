import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { TextInput } from '../text-input/text.input';
import type { Contact } from 'app/shared/models/contact.model';

export interface NameFields {
  last_name: string;
  first_name: string;
  middle_name: string;
  prefix: string;
  suffix: string;
}

export function populateName(contact: Contact): NameFields {
  return {
    last_name: contact.last_name ?? '',
    first_name: contact.first_name ?? '',
    middle_name: contact.middle_name ?? '',
    prefix: contact.prefix ?? '',
    suffix: contact.suffix ?? '',
  };
}

@Component({
  selector: 'app-name-form',
  imports: [TextInput, FormField],
  templateUrl: './name-form.component.html',
  styleUrl: './name-form.component.scss',
})
export class NameFormComponent {
  readonly fields = input.required<FieldTree<NameFields, string>>();
  readonly prefix = input<string>();
  readonly lastNameLabel = computed(() => {
    const prefix = this.prefix();
    const label = 'LAST NAME';
    return prefix ? `${prefix} ${label}` : label;
  });
  readonly firstNameLabel = computed(() => {
    const prefix = this.prefix();
    const label = 'FIRST NAME';
    return prefix ? `${prefix} ${label}` : label;
  });
  readonly middleNameLabel = computed(() => {
    const prefix = this.prefix();
    const label = 'MIDDLE NAME';
    return prefix ? `${prefix} ${label}` : label;
  });
  readonly prefixLabel = computed(() => {
    const prefix = this.prefix();
    const label = 'PREFIX';
    return prefix ? `${prefix} ${label}` : label;
  });
  readonly suffixLabel = computed(() => {
    const prefix = this.prefix();
    const label = 'SUFFIX';
    return prefix ? `${prefix} ${label}` : label;
  });
}
