import { Component, computed, effect, inject, signal } from '@angular/core';
import { apply, applyEach, disabled, form, FormField, hidden, required, submit } from '@angular/forms/signals';
import { ContactModalComponent } from 'app/shared/components/contact-modal/contact-modal.component';
import { ReportContactLookupComponent } from 'app/shared/components/report-contact-lookup/report-contact-lookup.component';
import { SaveCancelComponent } from 'app/shared/components/save-cancel/save-cancel.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Form1MService } from 'app/shared/services/form-1m.service';
import { Address, AddressFormComponent } from 'app/shared/components/signal-inputs/address-form/address-form.component';
import { NameFields, NameFormComponent } from 'app/shared/components/signal-inputs/name-form/name-form.component';
import { TextInputComponent } from 'app/shared/components/signal-inputs/text-input/text-input.component';
import { RadioInputComponent } from 'app/shared/components/signal-inputs/radio-input/radio-input.component';
import { effectOnceIf } from 'ngxtension/effect-once-if';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { Contact, ContactTypes, Form1M } from 'app/shared/models';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { CalendarComponent, StringDate } from 'app/shared/components/calendar/calendar.component';
import { requiredMessage, SchemaUtils } from 'app/shared/utils/schema.utils';
import { schema as F1MSchema } from 'fecfile-validate/fecfile_validate_js/dist/F1M';
import {
  CandidateOfficeData,
  CandidateOfficeFormComponent,
  candidateOfficeSchema,
  defaultCandidateOfficeData,
} from 'app/shared/components/signal-inputs/candidate-office-form/candidate-office-form.component';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

type ContactKeys = 'affiliated' | 'candidate-0' | 'candidate-1' | 'candidate-2' | 'candidate-3' | 'candidate-4';

interface CandidateContactData {
  candidate_id: string;
  name: NameFields;
  office: CandidateOfficeData;
  date_of_contribution: string;
}

const defaultCandidateData: CandidateContactData = {
  candidate_id: '',
  name: {
    last_name: '',
    first_name: '',
    middle_name: '',
    prefix: '',
    suffix: '',
  },
  office: { ...defaultCandidateOfficeData },
  date_of_contribution: '',
};

type StatusBy = 'affiliation' | 'qualification';

interface Form1MData {
  committee_type: string;
  filer_committee_id_number: string;
  committee_name: string;
  address: Address;
  affiliated: {
    date_form_f1_filed: StringDate;
    committee_fec_id: string;
    committee_name: string;
  };
  candidates: [
    CandidateContactData,
    CandidateContactData,
    CandidateContactData,
    CandidateContactData,
    CandidateContactData,
  ];
  date_of_original_registration: StringDate;
  date_of_51st_contributor: StringDate;
  date_committee_met_requirements: StringDate;
  statusBy: '' | StatusBy;
}

const initialData: Form1MData = {
  committee_type: '',
  filer_committee_id_number: '',
  committee_name: '',
  address: {
    street_1: '',
    street_2: '',
    city: '',
    state: '',
    zip: '',
  },
  affiliated: {
    date_form_f1_filed: null,
    committee_fec_id: '',
    committee_name: '',
  },
  candidates: [
    { ...defaultCandidateData },
    { ...defaultCandidateData },
    { ...defaultCandidateData },
    { ...defaultCandidateData },
    { ...defaultCandidateData },
  ],
  date_of_original_registration: null,
  date_of_51st_contributor: null,
  date_committee_met_requirements: null,
  statusBy: '',
};

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  imports: [
    ReportContactLookupComponent,
    SaveCancelComponent,
    ConfirmDialog,
    ContactModalComponent,
    FormField,
    TextInputComponent,
    RadioInputComponent,
    AddressFormComponent,
    CalendarComponent,
    NameFormComponent,
    CandidateOfficeFormComponent,
    ButtonModule,
  ],
  styleUrl: './main-form.component.scss',
})
export class MainFormComponent {
  private readonly router = inject(Router);
  private readonly reportService = inject(Form1MService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly store = inject(Store);
  private readonly committee = this.store.selectSignal(selectCommitteeAccount);
  readonly formModel = signal<Form1MData>(initialData);
  readonly form1MForm = form(this.formModel, (schemaPath) => {
    disabled(schemaPath.committee_name);
    disabled(schemaPath.filer_committee_id_number);
    disabled(schemaPath.address);
    required(schemaPath.statusBy, { message: requiredMessage });
    // Affiliation
    hidden(schemaPath.affiliated, ({ valueOf }) => valueOf(schemaPath.statusBy) !== 'affiliation');
    required(schemaPath.affiliated.committee_fec_id, {
      when: ({ valueOf }) => valueOf(schemaPath.statusBy) === 'affiliation',
      message: requiredMessage,
    });
    required(schemaPath.affiliated.committee_name, {
      when: ({ valueOf }) => valueOf(schemaPath.statusBy) === 'affiliation',
      message: requiredMessage,
    });
    required(schemaPath.affiliated.date_form_f1_filed, {
      when: ({ valueOf }) => valueOf(schemaPath.statusBy) === 'affiliation',
      message: requiredMessage,
    });
    // Qualification
    hidden(schemaPath.candidates, ({ valueOf }) => valueOf(schemaPath.statusBy) !== 'qualification');
    required(schemaPath.candidates, { when: ({ valueOf }) => valueOf(schemaPath.statusBy) === 'qualification' });
    required(schemaPath.date_committee_met_requirements, {
      when: ({ valueOf }) => valueOf(schemaPath.statusBy) === 'qualification',
      message: requiredMessage,
    });
    required(schemaPath.date_of_51st_contributor, {
      when: ({ valueOf }) => valueOf(schemaPath.statusBy) === 'qualification',
      message: requiredMessage,
    });
    required(schemaPath.date_of_original_registration, {
      when: ({ valueOf }) => valueOf(schemaPath.statusBy) === 'qualification',
      message: requiredMessage,
    });
    applyEach(schemaPath.candidates, (itemSchema) => {
      required(itemSchema.candidate_id, {
        when: ({ valueOf }) => valueOf(schemaPath.statusBy) === 'qualification',
        message: requiredMessage,
      });
      required(itemSchema.date_of_contribution, {
        when: ({ valueOf }) => valueOf(schemaPath.statusBy) === 'qualification',
        message: requiredMessage,
      });
      required(itemSchema.name.first_name, {
        when: ({ valueOf }) => valueOf(schemaPath.statusBy) === 'qualification',
        message: requiredMessage,
      });
      required(itemSchema.name.last_name, {
        when: ({ valueOf }) => valueOf(schemaPath.statusBy) === 'qualification',
        message: requiredMessage,
      });
      required(itemSchema.office.candidate_office, {
        when: ({ valueOf }) => valueOf(schemaPath.statusBy) === 'qualification',
        message: requiredMessage,
      });
      apply(itemSchema.office, candidateOfficeSchema);
    });
    const schemaFieldMap = SchemaUtils.generatePathMapFromForm(initialData);
    SchemaUtils.schemaFormValidatorBuilder(F1MSchema, schemaPath, schemaFieldMap);
  });

  readonly dialogVisible = signal(false);

  readonly statusByOptions = [
    { label: 'AFFILIATION', value: 'affiliation' },
    { label: 'QUALIFICATION', value: 'qualification' },
  ];
  readonly committeeTypeOptions = [
    { label: 'STATE PARTY', value: 'X' },
    { label: 'OTHER', value: 'N' },
  ];

  constructor() {
    effectOnceIf(
      () => this.committee(),
      (committee) => {
        this.form1MForm().value.update((value) => {
          return {
            ...value,
            committee_name: committee.name!,
            filer_committee_id_number: committee.committee_id!,
            address: {
              street_1: committee.street_1!,
              street_2: committee.street_1 ?? '',
              city: committee.city!,
              state: committee.state!,
              zip: committee.zip ?? '',
            },
          };
        });
      },
    );
  }

  submitForm(event: 'continue' | void) {
    submit(this.form1MForm, async () => {
      try {
        const confirmed = await this.getConfirmations();
        if (!confirmed) return;
        const payload = this.buildPayload();
        this.reportService.create(payload);
      } catch {}
    });
  }

  goBack() {
    this.router.navigateByUrl('/reports');
  }

  readonly affiliated = signal<Contact | null>(null);
  readonly candidates = signal<[Contact | null, Contact | null, Contact | null, Contact | null, Contact | null]>([
    null,
    null,
    null,
    null,
    null,
  ]);
  readonly excludeIds = computed(() => {
    const candidates = this.candidates();
    console.log(candidates[0]);
    return candidates.filter((c) => c !== null).map((c) => c.id!);
  });
  populateContact(contact: Contact, key?: string) {
    key = key ?? this.key();

    if (key === 'affiliated') {
      this.affiliated.set(contact);
      this.form1MForm.affiliated().value.update((v) => {
        return {
          date_form_f1_filed: v.date_form_f1_filed,
          committee_fec_id: contact.committee_id!,
          committee_name: contact.name!,
        };
      });
    } else {
      const num = +key.at(-1)!;
      this.candidates.update((c) => c.with(num, contact) as typeof c);
      this.form1MForm.candidates[num]().value.update((v) => {
        return {
          candidate_id: contact.candidate_id!,
          name: {
            last_name: contact.last_name!,
            first_name: contact.first_name!,
            middle_name: contact.middle_name ?? '',
            prefix: contact.prefix ?? '',
            suffix: contact.suffix ?? '',
          },
          office: {
            candidate_office: contact.candidate_office!,
            candidate_state: contact.candidate_state ?? '',
            candidate_district: contact.candidate_district ?? '',
          },
          date_of_contribution: v.date_of_contribution,
        };
      });
    }
  }

  readonly key = signal<ContactKeys>('affiliated');
  readonly contactType = signal<ContactTypes>(ContactTypes.COMMITTEE);
  readonly availableContactTypes = signal<PrimeOptions>([]);
  openDialog(data: { key: string; contactType: ContactTypes; options: PrimeOptions }) {
    this.contactType.set(data.contactType);
    this.availableContactTypes.set(data.options);
    this.key.set(data.key as ContactKeys);
    this.dialogVisible.set(true);
  }

  private buildPayload(): Form1M {
    // TODO
    return Form1M.fromJSON({});
  }

  private async getConfirmations(): Promise<boolean> {
    let message = '';
    if (this.form1MForm.statusBy().value() === 'affiliation') {
      const affiliated = this.affiliated();
      if (!affiliated) throw new Error('No affiliated');
      const value = this.form1MForm.affiliated().value();

      if (value.committee_fec_id !== affiliated?.committee_id)
        message += `<li>Updated committee id to <strong>${value.committee_fec_id}</strong></li>`;

      if (value.committee_name !== affiliated?.name)
        message += `<li>Updated committee name to <strong>${value.committee_name}</strong></li>`;
      if (message === '') return true;
      message =
        `Your suggested changes for <b>${affiliated.getNameString()}</b> will affect all transactions involving this contact.` +
        `<br><br>${message}`;
      return new Promise((resolve) => {
        this.confirmationService.confirm({
          header: 'Confirm',
          icon: 'pi pi-info-circle',
          message: message,
          acceptLabel: 'Continue',
          rejectLabel: 'Cancel',
          accept: () => resolve(true),
          reject: () => resolve(false),
        });
      });
    } else {
      const v = this.form1MForm.candidates().value();
      const candidates = this.candidates();
      for (const [index, value] of v.entries()) {
        const flatValue = { candidate_id: value.candidate_id, ...value.name, ...value.office };
        message = '';
        const candidate = candidates[index];
        if (!candidate) throw new Error(`No candidate at index ${index}`);
        for (const prop in flatValue) {
          const key = prop as keyof typeof flatValue;
          if ((flatValue[key] || '') !== (candidate[key] || ''))
            message += `<li>Updated ${prop.replaceAll('_', ' ')} to <strong>${flatValue[key]}</strong></li>`;
        }
        if (message === '') continue;
        message =
          `Your suggested changes for <b>${candidate.getNameString()}</b> will affect all transactions involving this contact.` +
          `<br><br>${message}`;
        const result = await new Promise((resolve) => {
          this.confirmationService.confirm({
            header: 'Confirm',
            icon: 'pi pi-info-circle',
            message: message,
            acceptLabel: 'Continue',
            rejectLabel: 'Cancel',
            accept: () => resolve(true),
            reject: () => resolve(false),
          });
        });
        if (!result) return false;
      }
      return true;
    }
  }
}
