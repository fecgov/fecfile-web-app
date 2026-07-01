import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, input, model, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-select-input',
  imports: [FormsModule, SelectModule, NgTemplateOutlet],
  template: `
    @if (!hidden()) {
      <span [class]="labelSyleClass() ?? 'span-label'" [id]="labelId()" [innerHTML]="label()"></span>
      <p-select
        [aria-labelledby]="labelId()"
        [options]="options()"
        [(ngModel)]="value"
        inputId="typeDropdown"
        (onHide)="touched.set(true)"
        [disabled]="disabled()"
        [class.p-disabled]="disabled()"
        appendTo="body"
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
export class SelectInput implements FormValueControl<string> {
  readonly value = model.required<string>();
  readonly options = input.required<PrimeOptions>();
  readonly labelId = input.required<string>();
  readonly label = input.required<string>();
  readonly touched = model(false);
  readonly labelSyleClass = input<string>();
  readonly disabled = input(false);
  readonly invalid = input(false);
  readonly hidden = input(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly searchable = input(false);

  readonly selectedItemTemplate = contentChild<
    TemplateRef<{
      $implicit: { label: string; value: string | boolean | null };
    }>
  >('selectedItem');
  readonly itemTemplate = contentChild<
    TemplateRef<{
      $implicit: { label: string; value: string | boolean | null };
    }>
  >('item');
}
