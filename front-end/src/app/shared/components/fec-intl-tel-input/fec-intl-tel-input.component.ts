import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ChangeData, CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-fec-intl-tel-input',
  templateUrl: './fec-intl-tel-input.component.html',
})
export class FecIntlTelInputComponent implements OnInit, OnDestroy {
  @Input() control: AbstractControl | null = null;

  private ngxIntlTelFormControl = new FormControl();
  phoneFormGroup = new FormGroup({ngxIntlTelFormControl: this.ngxIntlTelFormControl});
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates];
  PhoneNumberFormat = PhoneNumberFormat;
  SearchCountryField = SearchCountryField;

  private destroy$: Subject<boolean> = new Subject();

  ngOnInit(): void {
    this.control
    ?.valueChanges.pipe(takeUntil(this.destroy$))
    .subscribe((value: string) => {
      if (value) {
        const [fcDialCode, fcNationalNumber] = value.split(' ');
        const changeData: ChangeData = {
          dialCode: fcDialCode,
          number: fcNationalNumber
        }
        this.ngxIntlTelFormControl.setValue(changeData);
      }
    });

    this.ngxIntlTelFormControl
    ?.valueChanges.pipe(debounceTime(400),
    distinctUntilChanged(),takeUntil(this.destroy$))
    .subscribe(value => {
      if (value) {
        const newFormControlValue = 
          `${value['dialCode']} ${value['number']}`;
        if (newFormControlValue !== this.control?.value) {
          this.control?.setValue(newFormControlValue);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  
}
