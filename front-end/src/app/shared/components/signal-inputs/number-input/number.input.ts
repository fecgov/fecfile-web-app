import { Component } from '@angular/core';
import { LabelComponent } from '../label.component';
import { BaseInput } from '../base.input';

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
      />
      @if (touched() && invalid()) {
        <small class="p-error" role="alert">{{ errors()[0].message }}</small>
      }
    }
  `,
  styleUrls: ['../input.scss', './number.input.scss'],
})
export class NumberInput extends BaseInput<string> {}
