import { Component, computed, OnInit, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Contact } from 'app/shared/models';
import { CategoryCodeLabels, LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { schema as memoTextSchema } from 'fecfile-validate/fecfile_validate_js/dist/Text';
import { SelectItem } from 'primeng/api';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { BaseInputComponent } from '../base-input.component';
import { DesignatedSubordinateInputComponent } from '../designated-subordinate-input/designated-subordinate-input.component';
import { AutoResizeDirective } from 'app/shared/directives/auto-resize.directive';
import { SelectComponent } from '../../select/select.component';

@Component({
  selector: 'app-additional-info-input',
  templateUrl: './additional-info-input.component.html',
  styleUrls: ['./additional-info-input.component.scss'],
  imports: [
    ReactiveFormsModule,
    ErrorMessagesComponent,
    SelectComponent,
    AutoResizeDirective,
    DesignatedSubordinateInputComponent,
  ],
})
export class AdditionalInfoInputComponent extends BaseInputComponent implements OnInit {
  readonly designatingCommitteeSelect = output<SelectItem<Contact>>();
  readonly designatingCommitteeClear = output<void>();
  readonly subordinateCommitteeSelect = output<SelectItem<Contact>>();
  readonly subordinateCommitteeClear = output<void>();

  readonly categoryCodeOptions: PrimeOptions = LabelUtils.getPrimeOptions(CategoryCodeLabels);
  readonly purposeDescriptionPrefix = computed(() => this.transactionType()?.purposeDescriptionPrefix);
  readonly isDescriptionSystemGenerated = computed(
    () => this.transactionType()?.generatePurposeDescription !== undefined,
  );

  readonly pendingCommitteeText = `This information is system-generated based on the committee details provided in step two.

Add additional information as needed in the following Note or Memo Text box.`;

  ngOnInit(): void {
    SchemaUtils.addJsonSchemaValidators(this.form, memoTextSchema, false);
    this.form.updateValueAndValidity();
    const purposeDescriptionPrefix = this.purposeDescriptionPrefix();
    const purposeDescriptionControl = this.form.get(this.templateMap.purpose_description);
    if (purposeDescriptionPrefix) {
      this.initPrefix(this.templateMap.purpose_description, purposeDescriptionPrefix);
    }

    const text_prefix = this.transaction()?.memo_text?.text_prefix ?? this.transactionType()?.memoTextPrefix;

    if (text_prefix && text_prefix.length > 0) {
      this.initPrefix(this.templateMap.text4000, text_prefix + ' ');
    }

    // If this transaction type has a purpose description prefix, add a validator to the form control
    // to set a required error if only the prefix is present
    if (purposeDescriptionPrefix) {
      purposeDescriptionControl?.addValidators((control) =>
        control.value === purposeDescriptionPrefix ? { required: true } : null,
      );
    }

    if (this.isDescriptionSystemGenerated() && purposeDescriptionControl?.value.length === 0) {
      purposeDescriptionControl?.setValue(this.pendingCommitteeText);
    }
  }

  initPrefix(field: string, prefix: string) {
    // Watch changes to form text field to make sure prefix is maintained
    (this.form.get(field) as SubscriptionFormControl)?.addSubscription((value: string) => {
      if (value.length < prefix.length || !value.includes(': ')) {
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

  onDesignatingCommitteeSelect(selectItem: SelectItem<Contact>) {
    this.designatingCommitteeSelect.emit(selectItem);
  }

  onDesignatingCommitteeClear() {
    this.designatingCommitteeClear.emit();
  }

  onSubordinateCommitteeSelect(selectItem: SelectItem<Contact>) {
    this.subordinateCommitteeSelect.emit(selectItem);
  }

  onSubordinateCommitteeClear() {
    this.subordinateCommitteeClear.emit();
  }
}
