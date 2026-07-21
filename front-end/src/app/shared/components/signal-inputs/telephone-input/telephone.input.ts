import { Component, ElementRef, OnDestroy, viewChild } from '@angular/core';
import { BaseInput } from '../base.input';
import { LabelComponent } from '../label.component';
import intlTelInput, { Iti } from 'intl-tel-input';
import { pattern, SchemaPath } from '@angular/forms/signals';
import { patternMessage } from 'app/shared/utils/signal-validator.utils';

type IntlTelInputOptions = NonNullable<Parameters<typeof intlTelInput>[1]>;

export function validateTelephone(path: SchemaPath<string>) {
  pattern(path, /^\+\d{1,3} \d{10}$/, { message: patternMessage });
}

@Component({
  selector: 'app-telephone-input',
  imports: [LabelComponent],
  template: `<app-label [label]="label()" [inputId]="inputId()" [optional]="optional()" />
    <input
      #internationalPhoneInput
      [class.p-disabled]="disabled()"
      [disabled]="disabled()"
      type="tel"
      [id]="inputId()"
      (keyup)="onKey($event)"
      (blur)="onBlur()"
      (countryChange)="countryChange()"
    />
    @if (this.touched() && this.invalid()) {
      <small class="p-error" role="alert"> {{ this.errors()[0].message }} </small>
    }`,
  styleUrls: ['../input.scss', './telephone.input.scss'],
})
export class TelephoneInput extends BaseInput<string | null> implements OnDestroy {
  readonly internationalPhoneInputChild = viewChild.required<ElementRef<HTMLInputElement>>('internationalPhoneInput');

  private intlTelInput: Iti | undefined;
  private countryCode: string | undefined;
  private number = '';
  private isUpdatingInternally = false;

  private readonly intlTelInputOptions: IntlTelInputOptions = {
    separateDialCode: true,
    initialCountry: 'us',
    countryOrder: ['us'],
    allowDropdown: !this.disabled(),
  };

  countryChange() {
    this.countryCode = this.intlTelInput?.getSelectedCountryData().dialCode;
    this.propagateValue();
  }

  onKey(event: KeyboardEvent) {
    this.number = (event.target as HTMLInputElement).value;
    this.propagateValue();
  }

  onBlur() {
    this.touched.set(true);
  }

  private propagateValue(): void {
    const fullNumber = this.number ? `+${this.countryCode} ${this.number}` : null;

    this.isUpdatingInternally = true;
    this.value.set(fullNumber);
    this.isUpdatingInternally = false;
  }

  ngOnDestroy() {
    this.intlTelInput?.destroy();
  }
}
