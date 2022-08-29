import { AfterViewInit, Component, ElementRef, OnDestroy, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import * as intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-fec-intl-tel-input',
  templateUrl: './fec-intl-tel-input.component.html',
  styleUrls: ['./fec-intl-tel-input.component.scss'],
})
export class FecIntlTelInputComponent implements AfterViewInit, OnDestroy, 
  ControlValueAccessor {
  @ViewChild('telInput') telInput: ElementRef<HTMLInputElement> | null = null;

  private iti: intlTelInput.Plugin | null = null;
  private itiOptions: intlTelInput.Options = {
    separateDialCode: true,
  }
  private countryCode: string | undefined = '';
  private number = '';

  constructor(@Optional() @Self() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * Write form value to the DOM element (model => view)
   */
  writeValue(value: string): void {
    if (value) {
      this.iti?.setNumber(value);
      this.onChange(value);
    }
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
    if (this.telInput) {
      this.iti = intlTelInput(this.telInput.nativeElement, this.itiOptions);
      this.telInput.nativeElement.addEventListener("countrychange", () => {
        this.countryCode = this.iti?.getSelectedCountryData().dialCode;
        this.onChange('+' + this.countryCode + ' ' + this.number);
      });
    }
  }

  onKey(event: KeyboardEvent) { // without type info
    this.number = (event.target as HTMLInputElement).value;
    this.onChange('+' + this.countryCode + ' ' + this.number);
  }

  ngOnDestroy() {
    this.iti?.destroy();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange(value: string) {
    // noop
  }

}
