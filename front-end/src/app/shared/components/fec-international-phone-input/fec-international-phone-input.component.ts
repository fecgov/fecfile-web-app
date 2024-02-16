import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import * as intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-fec-international-phone-input',
  templateUrl: './fec-international-phone-input.component.html',
  styleUrls: ['./fec-international-phone-input.component.scss'],
})
export class FecInternationalPhoneInputComponent implements AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor {
  @Input() disabled = false;
  @ViewChild('internationalPhoneInput') internationalPhoneInputChild: ElementRef<HTMLInputElement> | undefined;

  private intlTelInput: intlTelInput.Plugin | undefined;
  private intlTelInputOptions: intlTelInput.Options = {
    separateDialCode: true,
    preferredCountries: ['us'],
    allowDropdown: !this.disabled
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
}
