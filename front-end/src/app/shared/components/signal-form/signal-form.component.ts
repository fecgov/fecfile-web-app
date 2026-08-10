import { computed, Directive, WritableSignal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

@Directive()
export abstract class SignalFormComponent<T> {
  protected abstract model: WritableSignal<T>;
  protected abstract form: FieldTree<T, string | number>;
  protected disableSubmission = computed(() => this.form().invalid() || this.form().submitting());
}
