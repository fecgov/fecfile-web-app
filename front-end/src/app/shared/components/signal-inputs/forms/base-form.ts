import { Directive, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

@Directive()
export abstract class BaseForm<T> {
  readonly fields = input.required<FieldTree<T, string>>();
}
