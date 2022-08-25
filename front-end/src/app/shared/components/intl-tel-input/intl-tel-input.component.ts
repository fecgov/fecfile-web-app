import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-intl-tel-input',
  templateUrl: './intl-tel-input.component.html',
  styleUrls: ['./intl-tel-input.component.scss'],
})
export class IntlTelInputComponent implements AfterViewInit, OnDestroy {
  @Input() telephone: FormControl = new FormControl();
  @Input() id: any;
  //@Input() formControlName: string | null = null;
  @Output() countryCodeChange = new EventEmitter<string>();
  @ViewChild('telInput') telInput: ElementRef<HTMLInputElement> | null = null;
  iti: intlTelInput.Plugin | null = null;
  itiOptions: intlTelInput.Options = {
  }
  selectedCountryCode: string | undefined;

  ngAfterViewInit(): void {
    if (this.telInput) {
      this.iti = intlTelInput(this.telInput.nativeElement, this.itiOptions);
      this.selectedCountryCode = this.iti.getSelectedCountryData().dialCode;
    }
    this.telInput?.nativeElement.addEventListener("countrychange", () => {
      this.countryCodeChange.emit(this.selectedCountryCode = 
        this.iti?.getSelectedCountryData().dialCode);
    });
  }

  ngOnDestroy() {
    this.iti?.destroy();
  }

}
