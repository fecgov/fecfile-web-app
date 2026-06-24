import {
  Component,
  computed,
  contentChild,
  ElementRef,
  inject,
  input,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { Options } from 'app/shared/utils/label.utils';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { NgTemplateOutlet } from '@angular/common';
import { IdGeneratorService } from 'app/shared/services/id-generator.service';

@Component({
  selector: 'app-select',
  imports: [FormsModule, ErrorMessagesComponent, NgTemplateOutlet],
  providers: [IdGeneratorService],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements ControlValueAccessor {
  private readonly idGen = inject(IdGeneratorService);
  readonly ngControl = inject(NgControl, { self: true, optional: true });
  readonly inputId = input.required<string>();
  readonly label = input.required<string>();
  readonly optionalLabel = input(false);
  readonly options = input.required<Options>();
  readonly labelClass = input<string>('');
  readonly formSubmitted = input<boolean>(false);
  readonly includeErrorMessages = input<boolean>(true);
  readonly showClear = input<boolean>(false);

  readonly customTemplate = contentChild<
    TemplateRef<{
      $implicit: { label: string; value: string | boolean | null };
    }>
  >('optionTemplate');

  readonly selectId = computed(() => this.idGen.getIdLabel(this.inputId()));

  readonly selectElement = viewChild.required<ElementRef<HTMLSelectElement>>('selectElement');
  readonly selected = viewChild.required<ElementRef>('selected');
  readonly update = output<string>();

  protected value: string | null = null;
  protected disabled = false;
  protected fieldName = '';
  protected onChange: (value: string | null) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
      this.fieldName = this.ngControl.name + '';
    }
  }
  writeValue(value: string | null): void {
    this.value = value;
  }
  registerOnChange = (fn: () => void) => (this.onChange = fn);
  registerOnTouched = (fn: () => void) => (this.onTouched = fn);
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  clear(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    this.writeValue(null);
    this.onChange(null);
    this.onTouched();
  }

  change(value: string | null) {
    this.onChange(value);
    this.onTouched();
  }
}
