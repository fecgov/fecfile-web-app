import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-label',
  imports: [],
  template: `
    @if (span()) {
      <span [class]="labelStyleClass() ?? 'span-label'" [id]="labelId()" [innerHTML]="fullLabel()"> </span>
    } @else {
      <label [class]="labelStyleClass() ?? ''" [id]="labelId()" [for]="inputId()" [innerHTML]="fullLabel()"> </label>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
    label,
    span {
      margin: 0 0 8px 0;
      align-self: end;
    }
  `,
})
export class LabelComponent {
  readonly label = input.required<string>();
  readonly inputId = input.required<string>();
  readonly optional = input.required<boolean>();
  readonly labelStyleClass = input<string>();
  readonly span = input(false);
  readonly labelId = computed(() => `${this.inputId()}-label`);
  readonly fullLabel = computed(() => {
    let label = this.label();
    if (this.optional()) {
      label += '<span class="paren-label"> (OPTIONAL)</span>';
    }
    return label;
  });
}
