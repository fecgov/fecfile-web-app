import { Component } from '@angular/core';
import { BaseInput } from '../base.input';
import { LabelComponent } from '../label.component';
import { AutoResizeDirective } from 'app/shared/directives/auto-resize.directive';

@Component({
  selector: 'app-text-area-input',
  imports: [LabelComponent, AutoResizeDirective],
  template: `
    <app-label [label]="label()" [inputId]="inputId()" [optional]="optional()" />
    <textarea
      [rows]="3"
      appAutoResize
      #textarea
      type="text"
      [value]="value()"
      [id]="inputId()"
      (blur)="touched.set(true)"
      (input)="value.set(textarea.value)"
    ></textarea>
    @if (touched() && invalid()) {
      <small class="p-error" role="alert"> {{ errors()[0].message }} </small>
    }
  `,
  styleUrls: ['../input.scss'],
})
export class TextAreaInput extends BaseInput<string> {}
