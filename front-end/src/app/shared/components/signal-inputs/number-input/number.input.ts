import { Component, computed, input } from '@angular/core';
import { LabelComponent } from '../label.component';
import { BaseInput } from '../base.input';
import { maxLength, minLength, PathKind, SchemaPath } from '@angular/forms/signals';

const yearFormatMessage = 'This field requires a 4-digit year (YYYY).';
export function validateYear(schemaPath: SchemaPath<string, 1, PathKind.Child>) {
  minLength(schemaPath, 4, { message: yearFormatMessage });
  maxLength(schemaPath, 4, { message: yearFormatMessage });
}

@Component({
  selector: 'app-number-input',
  imports: [LabelComponent],
  template: `
    @if (!hidden()) {
      <app-label
        [label]="label()"
        [inputId]="inputId()"
        [optional]="optional()"
        [labelStyleClass]="labelStyleClass()"
      />
      <input
        type="number"
        [value]="value()"
        [id]="inputId()"
        (blur)="touched.set(true)"
        (input)="value.set($event.target.value)"
        [disabled]="disabled()"
        [class.p-disabled]="disabled()"
        [class.p-invalid]="touched() && invalid()"
        type="text"
        inputmode="numeric"
        (keypress)="handleKeyDown($event)"
        (paste)="handlePaste($event)"
      />
      @if (touched() && invalid()) {
        <small class="p-error" role="alert">{{ errors()[0].message }}</small>
      }
    }
  `,
  styleUrls: ['../input.scss', './number.input.scss'],
})
export class NumberInput extends BaseInput<string> {
  readonly integerOnly = input(true);
  readonly positiveOnly = input(true);

  private readonly navKeys = new Set([
    'Backspace',
    'Delete',
    'Tab',
    'Enter',
    'Escape',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
  ]);

  readonly fullValidationRegex = computed(() => {
    const sign = this.positiveOnly() ? '' : '-?';
    if (this.integerOnly()) {
      return new RegExp(String.raw`^${sign}\d*$`);
    }
    return new RegExp(String.raw`^${sign}\d*\.?\d*$`);
  });

  handleKeyDown(event: KeyboardEvent) {
    // Allow standard shortcuts (Ctrl+A, Ctrl+C, Ctrl+V, etc.) and navigation keys
    if (event.ctrlKey || event.metaKey || this.navKeys.has(event.key)) {
      return;
    }

    // Block single-character keypresses that aren't allowed characters
    if (event.key.length === 1) {
      const input = event.target as HTMLInputElement;
      const currentValue = input.value || '';

      const start = input.selectionStart ?? currentValue.length;
      const end = input.selectionEnd ?? currentValue.length;
      const nextValue = currentValue.substring(0, start) + event.key + currentValue.substring(end);

      // Validate predicted value against regex
      if (!this.fullValidationRegex().test(nextValue)) event.preventDefault();
    }
  }

  handlePaste(event: ClipboardEvent) {
    const pastedData = event.clipboardData?.getData('text');
    if (!pastedData) return;

    const input = event.target as HTMLInputElement;
    const currentValue = input.value || '';

    const start = input.selectionStart ?? currentValue.length;
    const end = input.selectionEnd ?? currentValue.length;
    const nextValue = currentValue.substring(0, start) + pastedData.trim() + currentValue.substring(end);

    // Block paste if the final merged string is not a valid number
    if (!this.fullValidationRegex().test(nextValue)) event.preventDefault();
  }
}
