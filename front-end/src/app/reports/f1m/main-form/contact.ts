import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { MainFormComponent } from './main-form.component';
import { Form1M } from 'app/shared/models/form-1m.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';

export abstract class F1MContact {
  contactKey: keyof Form1M;
  get contactLookupKey(): string {
    return `${this.contactKey}_lookup`;
  }
  abstract contactTypeOptions: PrimeOptions;
  component: MainFormComponent;
  control: AbstractControl | null;
  abstract enableValidation(): void;
  abstract disableValidation(): void;
  abstract updateValueAndValidity(): void;

  constructor(contactKey: keyof Form1M, component: MainFormComponent) {
    this.contactKey = contactKey;
    this.component = component;
    component.form.addControl(this.contactLookupKey, new FormControl(''));
    this.control = component.form.get(this.contactLookupKey);
  }

  update($event: SelectItem<Contact>) {
    (this.component.report[this.contactKey as keyof Form1M] as Contact) = $event.value;
    if ($event.value.id) {
      (this.component.report[`${this.contactKey}_id` as keyof Form1M] as string) = $event.value.id;
    }
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

  enableValidation() {
    if (!this.component.report.affiliated_committee_name) {
      this.control?.addValidators(Validators.required);
    }
    this.component.form.get('affiliated_date_form_f1_filed')?.addValidators(Validators.required);
    this.component.form.get('affiliated_committee_fec_id')?.addValidators(Validators.required);
    this.component.form.get('affiliated_committee_name')?.addValidators(Validators.required);
    this.updateValueAndValidity();
  }

  disableValidation() {
    this.control?.clearValidators();
    this.component.report.contact_affiliated = undefined;
    this.component.report.contact_affiliated_id = null;
    this.component.report.affiliated_date_form_f1_filed = undefined;
    this.component.report.affiliated_committee_fec_id = undefined;
    this.component.report.affiliated_committee_name = undefined;

    this.component.form.get('affiliated_date_form_f1_filed')?.clearValidators();
    this.component.form.get('affiliated_committee_fec_id')?.clearValidators();
    this.component.form.get('affiliated_committee_name')?.clearValidators();

    this.component.form.get('affiliated_date_form_f1_filed')?.setValue(undefined);
    this.component.form.get('affiliated_committee_fec_id')?.setValue(undefined);
    this.component.form.get('affiliated_committee_name')?.setValue(undefined);

    this.updateValueAndValidity();
  }

  updateValueAndValidity() {
    this.control?.updateValueAndValidity();
    this.component.form.get('affiliated_date_form_f1_filed')?.updateValueAndValidity();
    this.component.form.get('affiliated_committee_fec_id')?.updateValueAndValidity();
    this.component.form.get('affiliated_committee_name')?.updateValueAndValidity();
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

  enableValidation() {
    if (!this.component.report[`${this.id}_candidate_id_number` as keyof Form1M]) {
      this.control?.addValidators(Validators.required);
    }
    this.component.form.get(`${this.id}_candidate_id_number`)?.addValidators(Validators.required);
    this.component.form.get(`${this.id}_candidate_last_name`)?.addValidators(Validators.required);
    this.component.form.get(`${this.id}_candidate_first_name`)?.addValidators(Validators.required);
    this.component.form.get(`${this.id}_candidate_office`)?.addValidators(Validators.required);
    this.component.form.get(`${this.id}_date_of_contribution`)?.addValidators(Validators.required);
    this.updateValueAndValidity();
  }

  disableValidation() {
    this.control?.clearValidators();
    (this.component.report[this.contactKey as keyof Form1M] as Contact | undefined) = undefined;
    (this.component.report[`${this.contactKey}_id` as keyof Form1M] as string | null) = null;
    (this.component.report[`${this.id}_candidate_id_number` as keyof Form1M] as string | undefined) = undefined;
    (this.component.report[`${this.id}_candidate_last_name` as keyof Form1M] as string | undefined) = undefined;
    (this.component.report[`${this.id}_candidate_first_name` as keyof Form1M] as string | undefined) = undefined;
    (this.component.report[`${this.id}_candidate_office` as keyof Form1M] as string | undefined) = undefined;
    (this.component.report[`${this.id}_candidate_state` as keyof Form1M] as string | undefined) = undefined;
    (this.component.report[`${this.id}_candidate_district` as keyof Form1M] as string | undefined) = undefined;
    (this.component.report[`${this.id}_candidate_date_of_contribution` as keyof Form1M] as Date | undefined) =
      undefined;

    this.component.form.get(`${this.id}_candidate_id_number`)?.clearValidators();
    this.component.form.get(`${this.id}_candidate_last_name`)?.clearValidators();
    this.component.form.get(`${this.id}_candidate_first_name`)?.clearValidators();
    this.component.form.get(`${this.id}_candidate_office`)?.clearValidators();
    this.component.form.get(`${this.id}_candidate_state`)?.clearValidators();
    this.component.form.get(`${this.id}_candidate_district`)?.clearValidators();
    this.component.form.get(`${this.id}_date_of_contribution`)?.clearValidators();

    this.component.form.get(`${this.id}_candidate_id_number`)?.setValue(undefined);
    this.component.form.get(`${this.id}_candidate_last_name`)?.setValue(undefined);
    this.component.form.get(`${this.id}_candidate_first_name`)?.setValue(undefined);
    this.component.form.get(`${this.id}_candidate_office`)?.setValue(undefined);
    this.component.form.get(`${this.id}_candidate_state`)?.setValue(undefined);
    this.component.form.get(`${this.id}_candidate_district`)?.setValue(undefined);
    this.component.form.get(`${this.id}_date_of_contribution`)?.setValue(undefined);

    this.updateValueAndValidity();
  }

  updateValueAndValidity() {
    this.control?.updateValueAndValidity();
    this.component.form.get(`${this.id}_candidate_id_number`)?.updateValueAndValidity();
    this.component.form.get(`${this.id}_candidate_last_name`)?.updateValueAndValidity();
    this.component.form.get(`${this.id}_candidate_first_name`)?.updateValueAndValidity();
    this.component.form.get(`${this.id}_candidate_office`)?.updateValueAndValidity();
    this.component.form.get(`${this.id}_candidate_state`)?.updateValueAndValidity();
    this.component.form.get(`${this.id}_candidate_district`)?.updateValueAndValidity();
    this.component.form.get(`${this.id}_date_of_contribution`)?.updateValueAndValidity();
  }
}
