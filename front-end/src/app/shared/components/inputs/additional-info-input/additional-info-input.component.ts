import { Component, Input, OnInit } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { LabelUtils, PrimeOptions, CategoryCodeLabels } from 'app/shared/utils/label.utils';

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
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.patchPurposeDescriptionPrefix();
  }

  patchPurposeDescriptionPrefix() {
    const prefix = this.purposeDescriptionPrefix;
    if (prefix) {
      const purposeField = this.form.get(this.templateMap.purpose_description);
      if (purposeField?.value?.length === 0) {
        purposeField?.setValue(prefix);
      } else if (prefix.startsWith(purposeField?.value)) {
        purposeField?.setValue(prefix);
      } else if (!purposeField?.value?.startsWith(prefix)) {
        purposeField?.setValue(prefix + purposeField?.value);
      }
    }
  }
}
