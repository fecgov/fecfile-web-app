import { AbstractControl, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { MainFormComponent } from './main-form.component';
import { Form1M } from 'app/shared/models/form-1m.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';

abstract class F1MContact {
  contactKey: keyof Form1M;
  get contactLookupKey(): string {
    return `${this.contactKey}_lookup`;
  }
  abstract contactTypeOptions: PrimeOptions;
  component: MainFormComponent;
  control: AbstractControl | null;

  constructor(contactKey: keyof Form1M, component: MainFormComponent) {
    this.contactKey = contactKey;
    this.component = component;
    component.form.addControl(this.contactLookupKey, new FormControl(''));
    this.control = component.form.get(this.contactLookupKey);
  }

  update($event: SelectItem<Contact>) {
    (this.component.report[this.contactKey as keyof Form1M] as Contact) = $event.value;
    for (const [key, value] of Object.entries(this.component.contactConfigs[this.contactKey])) {
      this.component.form
        .get(this.component.templateMapConfigs[this.contactKey][key as keyof TransactionTemplateMapType])
        ?.setValue($event.value[value as keyof Contact]);
    }
    this.control?.clearValidators();
    this.control?.updateValueAndValidity();
  }
}

export class AffiliatedContact extends F1MContact {
  contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);

  constructor(component: MainFormComponent) {
    super('contact_affiliated', component);

    component.contactConfigs[this.contactKey] = {
      committee_name: 'name',
      committee_fec_id: 'committee_id',
    };

    component.templateMapConfigs[this.contactKey] = {
      committee_name: 'affiliated_committee_name',
      committee_fec_id: 'affiliated_committee_fec_id',
    } as TransactionTemplateMapType;
  }
}

export class CandidateContact extends F1MContact {
  id: string;
  contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.CANDIDATE]);
  get dateOfContributionField() {
    return `${this.id}_date_of_contribution`;
  }

  constructor(id: string, component: MainFormComponent) {
    super(`contact_candidate_${id}` as keyof Form1M, component);

    this.id = id;

    component.contactConfigs[this.contactKey] = {
      candidate_fec_id: 'candidate_id',
      candidate_last_name: 'last_name',
      candidate_first_name: 'first_name',
      candidate_middle_name: 'middle_name',
      candidate_prefix: 'prefix',
      candidate_suffix: 'suffix',
      candidate_office: 'candidate_office',
      candidate_state: 'candidate_state',
      candidate_district: 'candidate_district',
    };

    component.templateMapConfigs[this.contactKey] = {
      candidate_fec_id: `${id}_candidate_id_number`,
      candidate_last_name: `${id}_candidate_last_name`,
      candidate_first_name: `${id}_candidate_first_name`,
      candidate_middle_name: `${id}_candidate_middle_name`,
      candidate_prefix: `${id}_candidate_prefix`,
      candidate_suffix: `${id}_candidate_suffix`,
      candidate_office: `${id}_candidate_office`,
      candidate_state: `${id}_candidate_state`,
      candidate_district: `${id}_candidate_district`,
    } as TransactionTemplateMapType;
  }
}
