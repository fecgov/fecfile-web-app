import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import intlTelInput, { Iti } from 'intl-tel-input';

@Component({
  selector: 'app-fec-international-phone-input',
  templateUrl: './fec-international-phone-input.component.html',
  styleUrls: ['./fec-international-phone-input.component.scss'],
})
export class FecInternationalPhoneInputComponent implements AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor {
  @Input() disabled = false;
  @Input() labelName = '';
  @ViewChild('internationalPhoneInput') internationalPhoneInputChild: ElementRef<HTMLInputElement> | undefined;

  private intlTelInput: Iti | undefined;
  private intlTelInputOptions = {
    separateDialCode: true,
    initialCountry: 'us',
    preferredCountries: ['us'],
    allowDropdown: !this.disabled,
  };
  private countryCode: string | undefined;
  private number = '';

  constructor(@Optional() @Self() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnChanges(): void {
    this.intlTelInputOptions.allowDropdown = !this.disabled;
  }

  /**
   * Write form value to the DOM element (model => view)
   */
  writeValue(value: string): void {
    this.intlTelInput?.setNumber(value || '');
    this.onChange(value);
  }

  /**
   * Update form when DOM element value changes (view => model)
   */
  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  /**
   * Update form when DOM element is blurred (view => model)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  registerOnTouched(fn: () => void): void {
    // noop
  }

  ngAfterViewInit(): void {
    if (this.internationalPhoneInputChild) {
      this.intlTelInput = intlTelInput(this.internationalPhoneInputChild.nativeElement, this.intlTelInputOptions);
      this.countryCode = this.intlTelInput?.getSelectedCountryData().dialCode;
      this.internationalPhoneInputChild.nativeElement.addEventListener('countrychange', () => {
        this.countryCode = this.intlTelInput?.getSelectedCountryData().dialCode;
        this.onChange('+' + this.countryCode + ' ' + this.number);
      });
    }

    if (this.labelName.length > 0) {
      const inputChildren = this.internationalPhoneInputChild?.nativeElement.parentNode?.childNodes;
      for (const childKey in inputChildren) {
        const childElement = inputChildren[childKey as unknown as number] as unknown as HTMLElement;
        if (childElement.classList?.contains('iti__country-container')) {
          for (const nephewElementKey in childElement.childNodes) {
            const nephewElement = childElement.childNodes[
              nephewElementKey as unknown as number
            ] as unknown as HTMLElement;
            if (nephewElement.classList?.contains('iti__selected-country')) {
              nephewElement.setAttribute('aria-labelledby', this.labelName);
            }
          }
        }
      }
    }
  }

  onKey(event: KeyboardEvent) {
    // without type info
    this.number = (event.target as HTMLInputElement).value;
    const fullNumber = this.number ? '+' + this.countryCode + ' ' + this.number : '';
    this.onChange(fullNumber);
  }

  ngOnDestroy() {
    this.intlTelInput?.destroy();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange(value: string) {
    // noop
  }

  onBlur(event: FocusEvent) {
    const value = `+${this.countryCode} ${(event.target as HTMLInputElement).value}`;
    this.ngControl.control?.setValue(value, { emitEvent: false });
    this.ngControl.control?.updateValueAndValidity();
    this.ngControl.control?.markAsTouched();
    this.ngControl.control?.markAsDirty();
  }
}
