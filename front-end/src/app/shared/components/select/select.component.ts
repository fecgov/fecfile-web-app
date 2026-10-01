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
import { FormControl, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms';
import { Options } from 'app/shared/utils/label.utils';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { NgTemplateOutlet } from '@angular/common';
import { IdGeneratorService } from 'app/shared/services/id-generator.service';
import { Select } from 'primeng/select';
import { PrimeTemplate } from 'primeng/api';

@Component({
  selector: 'app-select',
  imports: [ReactiveFormsModule, ErrorMessagesComponent, NgTemplateOutlet, Select, PrimeTemplate],
  providers: [IdGeneratorService],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent {
  private readonly idGen = inject(IdGeneratorService);
  readonly ngControl = inject(NgControl);
  readonly inputId = input.required<string>();
  readonly label = input.required<string>();
  readonly required = input(true);
  readonly options = input.required<Options>();
  readonly form = input.required<FormGroup>();
  readonly formControlName = input.required<string>();
  readonly labelClass = input<string>('span-label');
  readonly formSubmitted = input<boolean>(false);
  readonly includeErrorMessages = input<boolean>(true);
  readonly showClear = input<boolean>(false);
  readonly appendTo = input('self');

  readonly control = computed(() => this.ngControl.control as FormControl);
  readonly customTemplate = contentChild<
    TemplateRef<{
      $implicit: { label: string; value: string | boolean | null };
    }>
  >('optionTemplate');

  readonly selectId = computed(() => this.idGen.getIdLabel(this.inputId()));
  readonly selected = viewChild.required<ElementRef>('selected');
  readonly update = output<string>();

  constructor() {
    this.ngControl.valueAccessor = {
      writeValue: () => {},
      registerOnChange: () => {},
      registerOnTouched: () => {},
    };
  }
}
