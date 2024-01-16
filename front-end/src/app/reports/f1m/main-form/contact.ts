import { AbstractControl } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { MainFormComponent } from './main-form.component';
import { Form1M } from 'app/shared/models/form-1m.model';

abstract class F1MContact {
  abstract id: string;
  abstract contactTypeOptions: PrimeOptions;
  abstract update($event: SelectItem<Contact>): void;
  component: MainFormComponent;
  control: AbstractControl | null;

  constructor(formControlId: string, component: MainFormComponent) {
    component.form.addControl(formControlId, []);
    this.component = component;
    this.control = component.form.get(formControlId);
  }
}

export class AffiliatedContact extends F1MContact {
  id = 'affiliated';
  contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);

  constructor(component: MainFormComponent) {
    super('contactAffiliated_Lookup', component);

    component.contactConfigs['contact_affiliated'] = {
      committee_name: 'name',
      committee_fec_id: 'committee_id',
    };

    component.templateMapConfigs['contact_affiliated'] = {
      committee_name: 'affiliated_committee_name',
      committee_fec_id: 'affiliated_committee_fec_id',
    };
  }

  update($event: SelectItem<Contact>) {
    this.component.report.contact_affiliated = $event.value;
    this.component.form.get('affiliated_committee_fec_id')?.setValue($event.value.committee_id);
    this.component.form.get('affiliated_committee_name')?.setValue($event.value.name);
    this.component.affiliatedContact?.control?.clearValidators();
    this.component.affiliatedContact?.control?.updateValueAndValidity();
  }
}

export class CandidateContact extends F1MContact {
  id = '';
  contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.CANDIDATE]);

  constructor(id: string, component: MainFormComponent) {
    super(`contactCandidate${id}_Lookup`, component);
    this.id = id;

    component.contactConfigs[`contact_candidate_${id}`] = {
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

    component.templateMapConfigs[`contact_candidate_${id}`] = {
      candidate_fec_id: `${id}_candidate_id_number`,
      candidate_last_name: `${id}_candidate_last_name`,
      candidate_first_name: `${id}_candidate_first_name`,
      candidate_middle_name: `${id}_candidate_middle_name`,
      candidate_prefix: `${id}_candidate_prefix`,
      candidate_suffix: `${id}_candidate_suffix`,
      candidate_office: `${id}_candidate_office`,
      candidate_state: `${id}_candidate_state`,
      candidate_district: `${id}_candidate_district`,
    };
  }

  update($event: SelectItem<Contact>) {
    const field = `contact_candidate_${this.id}`;
    this.component.report[field as keyof Form1M] = $event.value as Contact;
    this.component.form.get('affiliated_committee_fec_id')?.setValue($event.value.committee_id);
    this.component.form.get('affiliated_committee_name')?.setValue($event.value.name);
    this.control?.clearValidators();
    this.control?.updateValueAndValidity();
  }
}
