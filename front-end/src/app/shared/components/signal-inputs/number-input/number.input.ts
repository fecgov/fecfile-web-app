import { Component, input } from '@angular/core';
import { LabelComponent } from '../label.component';
import { BaseInput } from '../base.input';
import { max, min, PathKind, SchemaPath, validate } from '@angular/forms/signals';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

const yearFormatMessage = 'This field requires a 4-digit year (YYYY).';
export function validateYear(schemaPath: SchemaPath<number | null, 1, PathKind.Child>) {
  min(schemaPath, 1000, { message: yearFormatMessage });
  max(schemaPath, 9999, { message: yearFormatMessage });
}

export function integer(field: SchemaPath<number | null>, options?: { message?: string }) {
  validate(field, ({ value }) => {
    const val = value();
    if (val === null || val === undefined) return null;
    if (!Number.isInteger(val)) {
      return {
        kind: 'integer',
        message: options?.message || 'Value must be a whole number',
      };
    }

    return null;
  });
}

@Component({
  selector: 'app-number-input',
  imports: [LabelComponent, InputNumberModule, FormsModule],
  template: `
    @if (!hidden()) {
      <app-label
        [label]="label()"
        [inputId]="inputId()"
        [optional]="optional()"
        [labelStyleClass]="labelStyleClass()"
      />
      <p-inputnumber
        [inputId]="inputId()"
        [(ngModel)]="value"
        [disabled]="disabled()"
        [useGrouping]="false"
        [min]="minValue()"
        [minlength]="minlength()"
        [maxlength]="maxlength()"
        (onBlur)="touched.set(true)"
        [class.ng-invalid]="invalid()"
      />
      @if (touched() && invalid()) {
        <small class="p-error" role="alert">{{ errors()[0].message }}</small>
      }
    }
  `,
  styleUrls: ['../input.scss', './number.input.scss'],
})
export class NumberInput extends BaseInput<number | null> {
  readonly minlength = input<number | null>(null);
  readonly maxlength = input<number | null>(null);
  readonly minValue = input<number>();
}
