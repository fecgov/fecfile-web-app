import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryCodeLabels, LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { schema as memoTextSchema } from 'fecfile-validate/fecfile_validate_js/dist/Text';
import { Select } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { BaseInputComponent } from '../base-input.component';
import { DesignatedSubordinateInputComponent } from '../designated-subordinate-input/designated-subordinate-input.component';

@Component({
  selector: 'app-additional-info-input',
  templateUrl: './additional-info-input.component.html',
  styleUrls: ['./additional-info-input.component.scss'],
  imports: [ReactiveFormsModule, ErrorMessagesComponent, Select, TextareaModule, DesignatedSubordinateInputComponent],
})
export class AdditionalInfoInputComponent extends BaseInputComponent implements OnInit {
  categoryCodeOptions: PrimeOptions = LabelUtils.getPrimeOptions(CategoryCodeLabels);

  ngOnInit(): void {
    SchemaUtils.addJsonSchemaValidators(this.form, memoTextSchema, false);
    this.form.updateValueAndValidity();

    if (this.transaction?.transactionType?.purposeDescriptionPrefix) {
      this.initPrefix(
        this.templateMap.purpose_description,
        this.transaction?.transactionType?.purposeDescriptionPrefix,
      );
    }

    const text_prefix = this.transaction?.memo_text?.text_prefix ?? this.transaction?.transactionType?.memoTextPrefix;

    if (text_prefix && text_prefix.length > 0) {
      this.initPrefix(this.templateMap.text4000, text_prefix + ' ');
    }
  }

  isDescriptionSystemGenerated(): boolean {
    // Description is system generated if there is a defined function.  Otherwise, it's mutable
    return this.transaction?.transactionType?.generatePurposeDescription !== undefined;
  }

  initPrefix(field: string, prefix: string) {
    // Watch changes to form text field to make sure prefix is maintained
    (this.form.get(field) as SubscriptionFormControl)?.addSubscription((value: string) => {
      if (value.length < prefix.length || value.indexOf(': ') < 0) {
        // Ensure prefix is the first part of the string in the textarea if no user text added
        this.form.get(field)?.setValue(prefix);
      } else if (!value.startsWith(prefix)) {
        // Retain user text in textarea if possible if user changes prefix
        this.form.get(field)?.setValue(prefix + value.slice(value.indexOf(': ') + 2));
      }
    }, this.destroy$);

    // Initialize value of form text field to prefix if empty
    if (!this.form.get(field)?.value) {
      this.form.get(field)?.setValue(prefix);
    }
  }
}
