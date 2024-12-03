import { AbstractControl, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { PrimeOptions, LabelUtils } from 'app/shared/utils/label.utils';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { MainFormComponent } from './main-form.component';
import { Form1M } from 'app/shared/models/form-1m.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { buildGuaranteeUniqueValuesValidator } from 'app/shared/utils/validators.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

export type F1MCandidateTag = 'I' | 'II' | 'III' | 'IV' | 'V';
export const f1mCandidateTags: F1MCandidateTag[] = ['I', 'II', 'III', 'IV', 'V'];

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
    component.form.addControl(this.contactLookupKey, new SubscriptionFormControl(''));
    this.control = component.form.get(this.contactLookupKey);
  }

  /**
   * Update the values in the form controls and contact object embedded in the
   * report object from the event emitted by the contact lookup component
   * @param $event
   */
  update($event: SelectItem<Contact>) {
    // If this is updating a previously selected candidate, remove it from the exclusion list.
    const previousId = this.component.report[`${this.contactKey}_id` as keyof Form1M] as string | null;
    this.component.excludeIds = this.component.excludeIds.filter((id: string) => id !== previousId);
    const currentId = $event.value.id ?? null;
    if (currentId) {
      this.component.excludeIds.push(currentId);
    }
    if (this.component.report[this.contactKey]?.committee_id) {
      this.component.excludeFecIds = this.component.excludeFecIds.filter(
        (id: string) => id !== this.component.report[this.contactKey].committee_id,
      );
    }
    if ($event.value.committee_id) {
      this.component.excludeFecIds.push($event.value.committee_id);
    }
    if (this.component.report[this.contactKey]?.candidate_id) {
      this.component.excludeFecIds = this.component.excludeFecIds.filter(
        (id: string) => id !== this.component.report[this.contactKey].candidate_id,
      );
    }
    if ($event.value.candidate_id) {
      this.component.excludeFecIds.push($event.value.candidate_id);
    }

    (this.component.report[this.contactKey] as Contact) = $event.value;
    (this.component.report[`${this.contactKey}_id` as keyof Form1M] as string | null) = currentId;
    for (const [key, value] of Object.entries(this.component.contactConfigs[this.contactKey])) {
      this.component.form
        .get(this.component.templateMapConfigs[this.contactKey][key as keyof TransactionTemplateMapType])
        ?.setValue($event.value[value as keyof Contact]);
    }

    // Touch the invalid contact id form control so the duplicate contact id message will appear if necessary.
    const candidateIdControl = this.component.form.get(
      this.component.templateMapConfigs[this.contactKey]['candidate_fec_id'],
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
    // Enable validation to lookup control if missing contact info
    if (!this.component.report.contact_affiliated) {
      this.control?.addValidators(Validators.required);
    }

    this.formFields.forEach((field: string) => this.component.form.get(field)?.addValidators(Validators.required));
    this.updateValueAndValidity();
  }
}

export class CandidateContact extends F1MContact {
  tag: F1MCandidateTag; // Valid values are: I, II, III, IV, V
  contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.CANDIDATE]);
  formFields: string[] = [];

  get dateOfContributionField() {
    return `${this.tag}_date_of_contribution`;
  }

  get candidateId() {
    return this.component.form.get(`${this.tag}_candidate_id_number`)?.value;
  }

  constructor(tag: F1MCandidateTag, component: MainFormComponent) {
    super(`contact_candidate_${tag}` as keyof Form1M, component);

    this.tag = tag;

    this.formFields = [
      `${tag}_candidate_id_number`,
      `${tag}_candidate_last_name`,
      `${tag}_candidate_first_name`,
      `${tag}_candidate_middle_name`,
      `${tag}_candidate_prefix`,
      `${tag}_candidate_suffix`,
      `${tag}_candidate_office`,
      `${tag}_candidate_state`,
      `${tag}_candidate_district`,
      `${tag}_date_of_contribution`,
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
      candidate_fec_id: `${tag}_candidate_id_number`,
      candidate_last_name: `${tag}_candidate_last_name`,
      candidate_first_name: `${tag}_candidate_first_name`,
      candidate_middle_name: `${tag}_candidate_middle_name`,
      candidate_prefix: `${tag}_candidate_prefix`,
      candidate_suffix: `${tag}_candidate_suffix`,
      candidate_office: `${tag}_candidate_office`,
      candidate_state: `${tag}_candidate_state`,
      candidate_district: `${tag}_candidate_district`,
    } as TransactionTemplateMapType;
  }

  enableValidation() {
    // Enable validation to lookup control if missing contact info
    if (!this.component.report[`contact_candidate_${this.tag}`]) {
      this.control?.addValidators(Validators.required);
    }

    const otherCandidateIdFields = f1mCandidateTags
      .filter((tag) => tag !== this.tag)
      .map((tag) => {
        return `${tag}_candidate_id_number`;
      });

    const candidateIdField = `${this.tag}_candidate_id_number`;

    this.component.form
      .get(`${this.tag}_candidate_id_number`)
      ?.addValidators([
        Validators.required,
        buildGuaranteeUniqueValuesValidator(
          this.component.form,
          candidateIdField,
          otherCandidateIdFields,
          'fecIdMustBeUnique',
        ),
      ]);
    this.component.form.get(`${this.tag}_candidate_last_name`)?.addValidators(Validators.required);
    this.component.form.get(`${this.tag}_candidate_first_name`)?.addValidators(Validators.required);
    this.component.form.get(`${this.tag}_candidate_office`)?.addValidators(Validators.required);
    this.component.form.get(`${this.tag}_date_of_contribution`)?.addValidators(Validators.required);
    this.updateValueAndValidity();
  }
}
