import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, input, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectModule } from 'primeng/select';
import { LabelComponent } from '../label.component';
import { BaseInput } from '../base.input';

type StringBooleanNull = string | boolean | null;

@Component({
  selector: 'app-select-input',
  imports: [FormsModule, SelectModule, NgTemplateOutlet, LabelComponent],
  template: `
    @if (!hidden()) {
      <app-label
        [span]="true"
        [label]="label()"
        [inputId]="inputId()"
        [optional]="!required()"
        [labelStyleClass]="labelStyleClass()"
      />
      <p-select
        [aria-labelledby]="inputId() + '-label'"
        [options]="options()"
        [(ngModel)]="value"
        [inputId]="inputId()"
        (onHide)="touched.set(true)"
        [disabled]="disabled()"
        [class.p-disabled]="disabled()"
        [appendTo]="appendTo()"
        [invalid]="touched() && invalid()"
      >
        @if (selectedItemTemplate()) {
          <ng-template #selectedItem let-selectedOption>
            <ng-container
              [ngTemplateOutlet]="selectedItemTemplate()!"
              [ngTemplateOutletContext]="{ $implicit: selectedOption }"
            >
            </ng-container>
          </ng-template>
        }

        @if (itemTemplate()) {
          <ng-template #item let-option>
            <ng-container [ngTemplateOutlet]="itemTemplate()!" [ngTemplateOutletContext]="{ $implicit: option }">
            </ng-container>
          </ng-template>
        }
      </p-select>
      @if (touched() && invalid()) {
        <small class="p-error">{{ errors()[0].message }}</small>
      }
    }
  `,
  styleUrls: ['../input.scss'],
})
export class SelectInput extends BaseInput<StringBooleanNull> {
  readonly options = input.required<PrimeOptions>();
  readonly appendTo = input('self');

  readonly selectedItemTemplate = contentChild<
    TemplateRef<{
      $implicit: { label: string; value: StringBooleanNull };
    }>
  >('selectedItem');
  readonly itemTemplate = contentChild<
    TemplateRef<{
      $implicit: { label: string; value: StringBooleanNull };
    }>
  >('item');
}
