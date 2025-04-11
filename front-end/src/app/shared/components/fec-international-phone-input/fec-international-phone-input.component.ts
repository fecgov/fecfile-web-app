import { AfterViewInit, Component, ElementRef, inject, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import intlTelInput, { Iti } from 'intl-tel-input';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';

@Component({
  selector: 'app-fec-international-phone-input',
  hostDirectives: [NgxControlValueAccessor],
  templateUrl: './fec-international-phone-input.component.html',
  styleUrls: ['./fec-international-phone-input.component.scss'],
})
export class FecInternationalPhoneInputComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() id = 'telephone';
  @Input() disabled = false;
  @Input() labelName = '';
  @ViewChild('internationalPhoneInput') internationalPhoneInputChild: ElementRef<HTMLInputElement> | undefined;

  protected cva = inject<NgxControlValueAccessor<string>>(NgxControlValueAccessor);

  private intlTelInput?: Iti;
  private readonly intlTelInputOptions = {
    separateDialCode: true,
    initialCountry: 'us',
    preferredCountries: ['us'],
    allowDropdown: !this.disabled,
  };
  private countryCode: string | undefined;
  private number = '';

  ngOnChanges(): void {
    this.intlTelInputOptions.allowDropdown = !this.disabled;
  }

  ngAfterViewInit(): void {
    if (this.internationalPhoneInputChild) {
      this.intlTelInput = intlTelInput(this.internationalPhoneInputChild.nativeElement, this.intlTelInputOptions);
      this.countryCode = this.intlTelInput?.getSelectedCountryData().dialCode;
      this.internationalPhoneInputChild.nativeElement.addEventListener('countrychange', () => {
        this.countryCode = this.intlTelInput?.getSelectedCountryData().dialCode;
        this.emitValue();
      });
    }

    // Initialize the field with any existing value
    this.intlTelInput?.setNumber(this.cva.value$() || '');
  }

  onKey(event: KeyboardEvent) {
    this.number = (event.target as HTMLInputElement).value;
    this.emitValue();
  }

  ngOnDestroy() {
    this.intlTelInput?.destroy();
  }

  onBlur() {
    this.cva.markAsTouched();
  }

  private emitValue() {
    const fullNumber = this.number ? `+${this.countryCode} ${this.number}` : '';
    this.cva.value = fullNumber;
  }
}
