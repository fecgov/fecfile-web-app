import { Directive, input } from '@angular/core';
import { BaseForm } from '../signal-inputs/forms/base-form';

@Directive()
export abstract class BaseContactForm<T> extends BaseForm<T> {
  readonly isNewItem = input.required<boolean>();
}
