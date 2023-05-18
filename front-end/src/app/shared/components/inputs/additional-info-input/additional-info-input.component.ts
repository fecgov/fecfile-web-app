import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { LabelUtils, PrimeOptions, CategoryCodeLabels } from 'app/shared/utils/label.utils';
import { ValidateUtils } from 'app/shared/utils/validate.utils';

@Component({
  selector: 'app-additional-info-input',
  templateUrl: './additional-info-input.component.html',
  styleUrls: ['./additional-info-input.component.scss'],
})
export class AdditionalInfoInputComponent extends BaseInputComponent implements OnInit {
  @Input() descriptionIsSystemGenerated = false;
  @Input() purposeDescriptionLabel = '';
  @Input() purposeDescriptionLabelNotice?: string;
  @Input() purposeDescriptionPrefix?: string;
  categoryCodeOptions: PrimeOptions = LabelUtils.getPrimeOptions(CategoryCodeLabels);

  ngOnInit(): void {
    if (this.purposeDescriptionPrefix) {
      // Add custom prefix required validation function to purpose description
      this.form.controls[this.templateMap.purpose_description].addValidators([
        ValidateUtils.prefixRequiredValidator(this.purposeDescriptionPrefix),
      ]);

      // Watch changes to purpose description to make sure prefix is maintained
      this.form
        .get(this.templateMap.purpose_description)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value: string) => {
          if (this.purposeDescriptionPrefix && value.length < this.purposeDescriptionPrefix.length) {
            // Ensure prefix is the first part of the string in the textarea if no user text added
            this.form.get(this.templateMap.purpose_description)?.setValue(this.purposeDescriptionPrefix);
          } else if (this.purposeDescriptionPrefix && !value.startsWith(this.purposeDescriptionPrefix)) {
            // Retain user text in textarea if possible if user changes prefix
            this.form
              .get(this.templateMap.purpose_description)
              ?.setValue(this.purposeDescriptionPrefix + value.slice(value.indexOf(': ') + 2));
          }
        });

      // Initialize value of purpose description to prefix if empty
      if (!this.form.get(this.templateMap.purpose_description)?.value) {
        this.form.get(this.templateMap.purpose_description)?.setValue(this.purposeDescriptionPrefix);
      }
    }
  }
}
