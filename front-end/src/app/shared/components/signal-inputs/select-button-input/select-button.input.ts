import { Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectButton } from 'primeng/selectbutton';
import { LabelComponent } from '../label.component';
import { BaseInput } from '../base.input';

@Component({
  selector: 'app-select-button-input',
  imports: [SelectButton, FormsModule, LabelComponent],
  template: `@if (!hidden()) {
    <app-label
      [span]="true"
      [label]="label()"
      [inputId]="inputId()"
      [optional]="!required()"
      [labelStyleClass]="labelStyleClass()"
    />
    <p-selectbutton [ariaLabelledBy]="labelId()" [options]="options()" [(ngModel)]="value" [id]="inputId()" />
    @if (dirty() && invalid()) {
      <small class="p-error">{{ errors()[0].message }}</small>
    }
  }`,
  styleUrls: ['../input.scss'],
})
export class SelectButtonInput extends BaseInput<string | null> {
  readonly labelId = computed(() => `${this.inputId()}-label`);
  readonly options = input.required<PrimeOptions>();
  readonly dirty = input(false);
}
