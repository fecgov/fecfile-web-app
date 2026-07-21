import { Component, computed, input } from '@angular/core';
import { TextInput } from '../text-input/text.input';
import { FieldTree, FormField, schema } from '@angular/forms/signals';
import type { Contact } from 'app/shared/models/contact.model';
import { validatePattern } from 'app/shared/utils/signal-validator.utils';

export interface NameData {
  last_name: string;
  first_name: string;
  middle_name: string;
  prefix: string;
  suffix: string;
}

export const nameSchema = schema<NameData>((schemaPath) => {
  validatePattern(schemaPath.first_name, /^[ -~]{0,20}$/, { required: true, max: 20 });
  validatePattern(schemaPath.last_name, /^[ -~]{0,30}$/, { required: true, max: 30 });
  validatePattern(schemaPath.middle_name, /^[ -~]{0,20}$/, { max: 20 });
  validatePattern(schemaPath.prefix, /^[ -~]{0,10}$/, { max: 10 });
  validatePattern(schemaPath.suffix, /^[ -~]{0,10}$/, { max: 10 });
});

export function populateName(contact?: Contact): NameData {
  return {
    last_name: contact?.last_name ?? '',
    first_name: contact?.last_name ?? '',
    middle_name: contact?.last_name ?? '',
    prefix: contact?.last_name ?? '',
    suffix: contact?.last_name ?? '',
  };
}

@Component({
  selector: 'app-name-form',
  imports: [TextInput, FormField],
  template: `
    <app-text-input
      class="start-row grid-col-4"
      [label]="lastNameLabel()"
      inputId="last_name"
      [formField]="fields().last_name"
    />
    <app-text-input
      class="grid-col-4"
      [label]="firstNameLabel()"
      inputId="first_name"
      [formField]="fields().first_name"
    />
    <app-text-input
      class="grid-col-4"
      [label]="middleNameLabel()"
      inputId="middle_name"
      [formField]="fields().middle_name"
    />
    <app-text-input class="grid-col-3" [label]="prefixLabel()" inputId="prefix" [formField]="fields().prefix" />
    <app-text-input class="grid-col-3" [label]="suffixLabel()" inputId="suffix" [formField]="fields().suffix" />
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class NameFormComponent {
  readonly fields = input.required<FieldTree<NameData, string>>();
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
