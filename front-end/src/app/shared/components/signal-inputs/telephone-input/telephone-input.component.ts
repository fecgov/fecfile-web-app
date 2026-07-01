import { Component, ElementRef, OnDestroy, viewChild, input, model, effect } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import intlTelInput, { Iti } from 'intl-tel-input';
import { effectOnceIf } from 'ngxtension/effect-once-if';

type IntlTelInputOptions = NonNullable<Parameters<typeof intlTelInput>[1]>;

@Component({
  selector: 'app-telephone-input',
  template: `<label id="telephone-label" for="telephone">TELEPHONE <span class="paren-label">(OPTIONAL)</span></label>
    <input
      [attr.aria-labelledby]="labelName()"
      [class.p-disabled]="disabled()"
      [disabled]="disabled()"
      #internationalPhoneInput
      type="tel"
      [id]="inputId()"
      [attr.labelName]="labelName()"
      (keyup)="onKey($event)"
      (blur)="onBlur()"
    />
    @if (this.touched() && this.invalid()) {
      <small class="p-error" role="alert"> {{ this.errors()[0].message }} </small>
    }`,
  styles: `
    :host {
      grid-row: span 3;
      display: grid;
      grid-template-rows: subgrid;
      gap: 0;

      & > label {
        margin-bottom: 8px;
        align-self: end;
      }
      & > .p-error {
        margin-top: 4px;
      }
    }

    .iti__flag {
      background-image: url('assets/img/intl-tel-input-flags.png');
    }

    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
      .iti__flag {
        background-image: url('assets/img/intl-tel-input-flags@2x.png');
      }
    }

    input {
      padding: 10px;
    }
  `,
})
export class TelephoneInputComponent implements FormValueControl<string | null>, OnDestroy {
  readonly value = model<string | null>(null);
  readonly disabled = input(false);
  readonly labelName = input('');
  readonly inputId = input.required<string>();
  readonly touched = model(false);
  readonly invalid = input(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
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

  constructor() {
    effect(() => {
      this.intlTelInputOptions.allowDropdown = !this.disabled();
      this.intlTelInput?.setDisabled(this.disabled());
    });

    effect(() => {
      const currentFormValue = this.value();
      if (!this.isUpdatingInternally) {
        this.intlTelInput?.setNumber(currentFormValue || '');
      }
    });

    effectOnceIf(
      () => this.internationalPhoneInputChild(),
      (input) => {
        const inputEl = input.nativeElement;
        this.intlTelInput = intlTelInput(inputEl, this.intlTelInputOptions);
        this.intlTelInput.setDisabled(this.disabled());
        this.countryCode = this.intlTelInput.getSelectedCountryData().dialCode;

        inputEl.addEventListener('countrychange', () => {
          this.countryCode = this.intlTelInput?.getSelectedCountryData().dialCode;
          this.propagateValue();
        });
      },
    );
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
