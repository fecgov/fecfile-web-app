import { Component, ElementRef, effect, input, viewChild, OnDestroy, inject, signal, computed } from '@angular/core';
import intlTelInput, { Iti } from 'intl-tel-input';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';

@Component({
  selector: 'app-fec-international-phone-input',
  hostDirectives: [NgxControlValueAccessor],
  standalone: true,
  templateUrl: './fec-international-phone-input.component.html',
  styleUrls: ['./fec-international-phone-input.component.scss'],
})
export class FecInternationalPhoneInputComponent implements OnDestroy {
  readonly id = input('telephone');
  readonly disabled = input(false);
  readonly labelName = input('');
  readonly internationalPhoneInput = viewChild.required<ElementRef<HTMLInputElement>>('internationalPhoneInput');

  protected cva = inject<NgxControlValueAccessor<string>>(NgxControlValueAccessor);

  private readonly intlTelInputOptions = {
    separateDialCode: true,
    initialCountry: 'us',
    preferredCountries: ['us'],
    allowDropdown: !this.disabled(),
  };

  private intlTelInput?: Iti;
  private readonly countryCode = signal<string | undefined>(undefined);
  private readonly number = signal('');
  private readonly fullNumber = computed(() => (this.number() ? `+${this.countryCode()} ${this.number()}` : ''));

  constructor() {
    effect(() => {
      this.cva.value = this.fullNumber();
    });
  }

  ngAfterViewInit(): void {
    const inputEl = this.internationalPhoneInput();
    if (!inputEl) return;

    this.intlTelInput = intlTelInput(inputEl.nativeElement, this.intlTelInputOptions);

    this.countryCode.set(this.intlTelInput.getSelectedCountryData().dialCode);

    inputEl.nativeElement.addEventListener('countrychange', () => {
      this.countryCode.set(this.intlTelInput?.getSelectedCountryData().dialCode);
    });

    this.intlTelInput.setNumber(this.cva.value$() || '');
  }

  onKey(event: KeyboardEvent) {
    this.number.set((event.target as HTMLInputElement).value);
  }

  onBlur() {
    this.cva.markAsTouched();
  }

  ngOnDestroy() {
    this.intlTelInput?.destroy();
  }
}
