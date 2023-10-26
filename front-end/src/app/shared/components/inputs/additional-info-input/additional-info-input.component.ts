import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { LabelUtils, PrimeOptions, CategoryCodeLabels } from 'app/shared/utils/label.utils';
import { schema as memoTextSchema } from 'fecfile-validate/fecfile_validate_js/dist/Text';
import { ValidateUtils } from 'app/shared/utils/validate.utils';

@Component({
  selector: 'app-additional-info-input',
  templateUrl: './additional-info-input.component.html',
  styleUrls: ['./additional-info-input.component.scss'],
})
export class AdditionalInfoInputComponent extends BaseInputComponent implements OnInit {
  categoryCodeOptions: PrimeOptions = LabelUtils.getPrimeOptions(CategoryCodeLabels);

  ngOnInit(): void {
    ValidateUtils.addJsonSchemaValidators(this.form, memoTextSchema, false);

    const purposeDescriptionPrefix = this.transaction?.transactionType?.purposeDescriptionPrefix;

    if (purposeDescriptionPrefix) {
      // Add custom prefix required validation function to purpose description
      this.form.controls[this.templateMap.purpose_description].addValidators([
        ValidateUtils.prefixRequiredValidator(purposeDescriptionPrefix),
      ]);

      // Watch changes to purpose description to make sure prefix is maintained
      this.form
        .get(this.templateMap.purpose_description)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value: string) => {
          if (value.length < purposeDescriptionPrefix.length) {
            // Ensure prefix is the first part of the string in the textarea if no user text added
            this.form.get(this.templateMap.purpose_description)?.setValue(purposeDescriptionPrefix);
          } else if (!value.startsWith(purposeDescriptionPrefix)) {
            // Retain user text in textarea if possible if user changes prefix
            this.form
              .get(this.templateMap.purpose_description)
              ?.setValue(purposeDescriptionPrefix + value.slice(value.indexOf(': ') + 2));
          }
        });

      // Initialize value of purpose description to prefix if empty
      if (!this.form.get(this.templateMap.purpose_description)?.value) {
        this.form.get(this.templateMap.purpose_description)?.setValue(purposeDescriptionPrefix);
      }
    }
  }

  isDescriptionSystemGenerated(): boolean {
    // Description is system generated if there is a defined function.  Otherwise, it's mutable
    return this.transaction?.transactionType?.generatePurposeDescription !== undefined;
  }
}
