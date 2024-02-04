import { AbstractControl, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { PrimeOptions, LabelUtils } from 'app/shared/utils/label.utils';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { MainFormComponent } from './main-form.component';
import { Form1M } from 'app/shared/models/form-1m.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';

/**
 * Angular validation callback function to invalidate contacts with the same contact id.
 * @param controlId
 * @param component
 * @returns
 */
function duplicateCandidateIdValidator(controlId: string, component: MainFormComponent): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const isDuplicate = component.getSelectedContactIds(controlId).includes(value);
    return isDuplicate ? { fecIdMustBeUnique: true } : null;
  };
}

export abstract class F1MContact {
  contactKey: keyof Form1M;
  get contactLookupKey(): string {
    return `${this.contactKey}_lookup`;
  }
  abstract contactTypeOptions: PrimeOptions;
  abstract formFields: string[];
  component: MainFormComponent;
  control: AbstractControl | null;
  abstract enableValidation(): void;

  constructor(contactKey: keyof Form1M, component: MainFormComponent) {
    this.contactKey = contactKey;
    this.component = component;
    component.form.addControl(this.contactLookupKey, new FormControl(''));
    this.control = component.form.get(this.contactLookupKey);
  }

  /**
   * Update the values in the form controls and contact object embedded in the
   * report object from the event emitted by the contact lookup component
   * @param $event
   */
  update($event: SelectItem<Contact>) {
    (this.component.report[this.contactKey] as Contact) = $event.value;
    if ($event.value.id) {
      (this.component.report[`${this.contactKey}_id` as keyof Form1M] as string) = $event.value.id;
    }
    for (const [key, value] of Object.entries(this.component.contactConfigs[this.contactKey])) {
      this.component.form
        .get(this.component.templateMapConfigs[this.contactKey][key as keyof TransactionTemplateMapType])
        ?.setValue($event.value[value as keyof Contact]);
    }

    // Touch the invalid contact id form control so the duplicate contact id message will appear if necessary.
    const candidateIdControl = this.component.form.get(
      this.component.templateMapConfigs[this.contactKey]['candidate_fec_id']
    );
    if (candidateIdControl?.invalid) {
      candidateIdControl.markAsTouched();
    }

    this.control?.clearValidators();
    this.control?.updateValueAndValidity();
  }

  disableValidation() {
    this.control?.clearValidators();
    (this.component.report[this.contactKey] as Contact | undefined) = undefined;
    (this.component.report[`${this.contactKey}_id` as keyof Form1M] as string | null) = null;

    this.formFields.forEach((field: string) => {
      (this.component.report[field as keyof Form1M] as string | undefined) = undefined;
      this.component.form.get(field)?.clearValidators();
      this.component.form.get(field)?.setValue(undefined);
    });

    this.updateValueAndValidity();
  }

  updateValueAndValidity() {
    this.control?.updateValueAndValidity();
    this.formFields.forEach((field: string) => this.component.form.get(field)?.updateValueAndValidity());
  }
}

export class AffiliatedContact extends F1MContact {
  contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);
  formFields = ['affiliated_date_form_f1_filed', 'affiliated_committee_fec_id', 'affiliated_committee_name'];

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
    // Enable validation to lookup control if missing first required contact field
    if (!this.component.report.affiliated_committee_name) {
      this.control?.addValidators(Validators.required);
    }

    this.formFields.forEach((field: string) => this.component.form.get(field)?.addValidators(Validators.required));
    this.updateValueAndValidity();
  }
}

export class CandidateContact extends F1MContact {
  id: string;
  contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.CANDIDATE]);
  formFields: string[] = [];

  get dateOfContributionField() {
    return `${this.id}_date_of_contribution`;
  }

  get candidateId() {
    return this.component.form.get(`${this.id}_candidate_id_number`)?.value;
  }

  constructor(id: string, component: MainFormComponent) {
    super(`contact_candidate_${id}` as keyof Form1M, component);

    this.id = id;

    this.formFields = [
      `${this.id}_candidate_id_number`,
      `${this.id}_candidate_last_name`,
      `${this.id}_candidate_first_name`,
      `${this.id}_candidate_middle_name`,
      `${this.id}_candidate_prefix`,
      `${this.id}_candidate_suffix`,
      `${this.id}_candidate_office`,
      `${this.id}_candidate_state`,
      `${this.id}_candidate_district`,
      `${this.id}_date_of_contribution`,
    ];

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
    // Enable validation to lookup control if missing first required contact field
    if (!this.component.report[`${this.id}_candidate_id_number` as keyof Form1M]) {
      this.control?.addValidators(Validators.required);
    }

    this.component.form
      .get(`${this.id}_candidate_id_number`)
      ?.addValidators([Validators.required, duplicateCandidateIdValidator(this.id, this.component)]);
    this.component.form.get(`${this.id}_candidate_last_name`)?.addValidators(Validators.required);
    this.component.form.get(`${this.id}_candidate_first_name`)?.addValidators(Validators.required);
    this.component.form.get(`${this.id}_candidate_office`)?.addValidators(Validators.required);
    this.component.form.get(`${this.id}_date_of_contribution`)?.addValidators(Validators.required);
    this.updateValueAndValidity();
  }
}
