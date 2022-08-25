import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { first, Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-fec-intl-tel-input',
  templateUrl: './fec-intl-tel-input.component.html',
})
export class FecIntlTelInputComponent implements OnInit, OnDestroy {
  @Input() control: AbstractControl | null = null;

  private ngxIntlTelFormControl = new FormControl();
  phoneFormGroup = new FormGroup(
    {ngxIntlTelFormControl: this.ngxIntlTelFormControl});
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates];
  PhoneNumberFormat = PhoneNumberFormat;
  SearchCountryField = SearchCountryField;

  private destroy$: Subject<boolean> = new Subject();

  ngOnInit(): void {
    this.control
    ?.valueChanges.pipe(first((value: string) => !!value))
    .subscribe((value: string) => {
      this.ngxIntlTelFormControl.setValue(value);
    });

    this.ngxIntlTelFormControl
    ?.valueChanges.pipe(takeUntil(this.destroy$))
    .subscribe(value => {
      if (value) {
        // Can't use internationalNumber since it can 
        // include added parens/dashes
        const newFormControlValue = 
          `${value['dialCode']} ${value['number']}`; 
        if (newFormControlValue !== this.control?.value) {
          this.control?.setValue(newFormControlValue);
        }

        // Workaround for an apparent bug that is causing 
        // the intl code to be included in the number field.
        const number: string = value.number;
        if (number) {
          const tokens = number.split(' ');
          if (tokens && tokens.length > 1) {
            value.number = tokens[1];
            this.ngxIntlTelFormControl.setValue(value);
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  
}
