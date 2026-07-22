import { Component, ElementRef, effect, viewChild } from '@angular/core';
import { pattern, SchemaPath } from '@angular/forms/signals';
import { patternMessage } from 'app/shared/utils/signal-validator.utils';
import intlTelInput, { Iti } from 'intl-tel-input';
import { BaseInput } from '../base.input';
import { LabelComponent } from '../label.component';

type IntlTelInputOptions = NonNullable<Parameters<typeof intlTelInput>[1]>;

export function validateTelephone(path: SchemaPath<string>) {
  pattern(path, /^\+\d{1,3} \d{10}$/, { message: patternMessage });
}

@Component({
  selector: 'app-telephone-input',
  template: ` <app-label [label]="label()" [inputId]="inputId()" [optional]="optional()" />
    <input
      type="tel"
      #internationalPhoneInput
      [id]="inputId()"
      [disabled]="disabled()"
      [class.p-disabled]="disabled()"
      (keyup)="onKey($event)"
      (blur)="onBlur($event)"
    />
    @if (touched() && invalid()) {
      <small class="p-error" role="alert"> {{ errors()[0].message }} </small>
    }`,
  styleUrls: ['../input.scss', './telephone.input.scss'],
  imports: [LabelComponent],
})
export class TelephoneInput extends BaseInput<string | null> {
  readonly internationalPhoneInputChild = viewChild.required<ElementRef<HTMLInputElement>>('internationalPhoneInput');

  private intlTelInput: Iti | undefined;
  private countryCode: string | undefined;
  private number = '';

  constructor() {
    super();
    effect((onCleanup) => {
      const inputElem = this.internationalPhoneInputChild().nativeElement;

      const options: IntlTelInputOptions = {
        separateDialCode: true,
        initialCountry: 'us',
        countryOrder: ['us'],
        allowDropdown: !this.disabled(),
      };

      this.intlTelInput = intlTelInput(inputElem, options);
      this.intlTelInput.setDisabled(this.disabled());
      this.countryCode = this.intlTelInput.getSelectedCountryData().dialCode;

      inputElem.addEventListener('countrychange', this.handleCountryChange);

      onCleanup(() => {
        inputElem.removeEventListener('countrychange', this.handleCountryChange);
        this.intlTelInput?.destroy();
        this.intlTelInput = undefined;
      });
    });

    effect(() => {
      const val = this.value();
      if (this.intlTelInput && val !== null) {
        this.intlTelInput.setNumber(val);
      }
    });

    effect(() => {
      if (this.intlTelInput) {
        this.intlTelInput.setDisabled(this.disabled());
      }
    });
  }

  handleCountryChange() {
    this.countryCode = this.intlTelInput?.getSelectedCountryData().dialCode;
    this.updateValue();
  }

  onKey(event: KeyboardEvent) {
    this.number = (event.target as HTMLInputElement).value;
    this.updateValue();
  }

  onBlur(event: FocusEvent) {
    const inputValue = (event.target as HTMLInputElement).value.trim();
    if (!inputValue) {
      this.value.set(null);
    } else {
      this.updateValue();
    }
    this.touched.set(true);
  }

  private updateValue(): void {
    if (this.number) {
      const fullNumber = `+${this.countryCode} ${this.number}`;
      this.value.set(fullNumber);
    } else {
      this.value.set(null);
    }
  }
}
