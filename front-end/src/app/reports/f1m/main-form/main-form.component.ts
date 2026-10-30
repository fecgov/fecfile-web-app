import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainFormBaseComponent } from 'app/reports/shared/main-form-base.component';
import { TransactionContactUtils } from 'app/shared/components/transaction-type-base/transaction-contact.utils';
import { Contact } from 'app/shared/models/contact.model';
import { Form1M } from 'app/shared/models/reports/form-1m.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { Form1MService } from 'app/shared/services/form-1m.service';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { schema as f1mSchema } from 'fecfile-validate/fecfile_validate_js/dist/F1M';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputText } from 'primeng/inputtext';
import { RadioButton } from 'primeng/radiobutton';
import { CalendarComponent } from '../../../shared/components/calendar/calendar.component';
import { ErrorMessagesComponent } from '../../../shared/components/error-messages/error-messages.component';
import { AddressInputComponent } from '../../../shared/components/inputs/address-input/address-input.component';
import {
  blankCandidateOfficeModel,
  buildCandidateSchema,
  CandidateOfficeFormComponent,
  CandidateOfficeModel,
} from 'app/shared/components/signal-form/candidate-office-form/candidate-office-form.component';
import { NameInputComponent } from '../../../shared/components/inputs/name-input/name-input.component';
import { SaveCancelComponent } from '../../../shared/components/save-cancel/save-cancel.component';
import { AffiliatedContact, CandidateContact, F1MCandidateTag, f1mCandidateTags, F1MContact } from './contact';
import { ConfirmationWrapperService } from 'app/shared/services/confirmation-wrapper.service';
import { ReportContactLookupComponent } from 'app/shared/components/report-contact-lookup/report-contact-lookup.component';
import { ContactService } from 'app/shared/services/contact.service';
import { ContactModalComponent } from 'app/shared/components/contact-modal/contact-modal.component';
import { ContactManagementService } from 'app/shared/services/contact-management.service';
import { ToUpperDirective } from 'app/shared/directives/to-upper.directive';
import { candidatePatternMessage } from 'app/shared/models/candidate.model';
import { committeePatternMessage } from 'app/shared/models/committee-account.model';
import { compatForm } from '@angular/forms/signals/compat';
import { applyWhen, required, submit, FormField } from '@angular/forms/signals';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';
import { RadioButtonInput } from 'app/shared/components/signal-inputs/radio-button-input/radio-button.input';

export type CandidateOfficeModels = Record<F1MCandidateTag, CandidateOfficeModel>;

interface MainFormModel {
  statusBy: 'qualification' | 'affiliation' | null;
  contactForm: FormGroup;
  candidateOffices: CandidateOfficeModels;
}

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  imports: [
    ReactiveFormsModule,
    InputText,
    ErrorMessagesComponent,
    RadioButton,
    AddressInputComponent,
    ReportContactLookupComponent,
    CalendarComponent,
    NameInputComponent,
    CandidateOfficeFormComponent,
    SaveCancelComponent,
    ConfirmDialog,
    ContactModalComponent,
    ToUpperDirective,
    RadioButtonInput,
    FormField,
  ],
  styleUrl: './main-form.component.scss',
})
export class MainFormComponent extends MainFormBaseComponent<Form1M> implements OnInit, OnDestroy {
  readonly cmservice = inject(ContactManagementService);
  protected readonly reportService: Form1MService = inject(Form1MService);
  readonly contactService = inject(ContactService);
  protected readonly confirmationService = inject(ConfirmationWrapperService);

  readonly f1mCandidateTags = f1mCandidateTags;
  readonly committeePatternMessage = committeePatternMessage;
  readonly candidatePatternMessage = candidatePatternMessage;
  readonly formProperties: string[] = [
    'committee_type',
    'filer_committee_id_number',
    'committee_name',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'affiliated_date_form_f1_filed',
    'affiliated_committee_fec_id',
    'affiliated_committee_name',
    'I_candidate_id_number',
    'I_candidate_last_name',
    'I_candidate_first_name',
    'I_candidate_middle_name',
    'I_candidate_prefix',
    'I_candidate_suffix',
    'I_date_of_contribution',
    'II_candidate_id_number',
    'II_candidate_last_name',
    'II_candidate_first_name',
    'II_candidate_middle_name',
    'II_candidate_prefix',
    'II_candidate_suffix',
    'II_date_of_contribution',
    'III_candidate_id_number',
    'III_candidate_last_name',
    'III_candidate_first_name',
    'III_candidate_middle_name',
    'III_candidate_prefix',
    'III_candidate_suffix',
    'III_date_of_contribution',
    'IV_candidate_id_number',
    'IV_candidate_last_name',
    'IV_candidate_first_name',
    'IV_candidate_middle_name',
    'IV_candidate_prefix',
    'IV_candidate_suffix',
    'IV_date_of_contribution',
    'V_candidate_id_number',
    'V_candidate_last_name',
    'V_candidate_first_name',
    'V_candidate_middle_name',
    'V_candidate_prefix',
    'V_candidate_suffix',
    'V_date_of_contribution',
    'date_of_original_registration',
    'date_of_51st_contributor',
    'date_committee_met_requirements',
  ];
  readonly schema = f1mSchema;
  readonly webprintURL = '/reports/f1m/web-print/';
  readonly statusByOptions = ['affiliation', 'qualification'];

  contactConfigs: { [contactKey: string]: { [formField: string]: string } } = {};
  templateMapConfigs: { [contactKey: string]: TransactionTemplateMapType } = {};

  readonly form = this.fb.group(SchemaUtils.getFormGroupFieldsNoBlur(this.formProperties), { updateOn: 'blur' });

  committeeTypeControl: AbstractControl | null = null;
  affiliatedContact: AffiliatedContact = {} as AffiliatedContact;
  candidateContacts: CandidateContact[] = [];

  report = new Form1M();

  readonly formModel = signal<MainFormModel>({
    contactForm: this.form,
    statusBy: null,
    candidateOffices: {
      I: blankCandidateOfficeModel(),
      II: blankCandidateOfficeModel(),
      III: blankCandidateOfficeModel(),
      IV: blankCandidateOfficeModel(),
      V: blankCandidateOfficeModel(),
    },
  });

  readonly signalForm = compatForm(
    this.formModel,
    (schema) => {
      required(schema.statusBy, { message: requiredMessage });
      for (const item of f1mCandidateTags) {
        applyWhen(
          schema.candidateOffices[item],
          ({ valueOf }) => valueOf(schema.statusBy) === 'qualification',
          buildCandidateSchema({
            defaultOffice: () => undefined,
            presidentialScheduleE: () => false,
          }),
        );
      }
    },
    {
      submission: {
        action: () => this.submit(),
        onInvalid: () => {
          this.form.markAllAsTouched();
          this.scrollToFirstInvalidControl();
        },
      },
    },
  );

  readonly disableSubmission = computed(() => {
    const sf = this.signalForm();
    return sf.submitting() || sf.invalid() || !sf.dirty();
  });
  private jump?: 'continue';

  constructor() {
    super();
    effect(() => {
      const value = this.signalForm.statusBy().value();
      SchemaUtils.addJsonSchemaValidators(this.form, this.schema, true);
      if (value === 'affiliation') {
        this.enableValidation([this.affiliatedContact]);
        this.disableValidation(this.candidateContacts);
        this.form.get('date_of_original_registration')?.clearValidators();
        this.form.get('date_of_51st_contributor')?.clearValidators();
        this.form.get('date_committee_met_requirements')?.clearValidators();
        this.form.get('date_of_original_registration')?.setValue(undefined);
        this.form.get('date_of_51st_contributor')?.setValue(undefined);
        this.form.get('date_committee_met_requirements')?.setValue(undefined);
      } else {
        this.enableValidation(this.candidateContacts);
        this.form.get('date_of_original_registration')?.addValidators(Validators.required);
        this.form.get('date_of_51st_contributor')?.addValidators(Validators.required);
        this.form.get('date_committee_met_requirements')?.addValidators(Validators.required);
        this.disableValidation([this.affiliatedContact]);
      }
      this.form.get('date_of_original_registration')?.updateValueAndValidity();
      this.form.get('date_of_51st_contributor')?.updateValueAndValidity();
      this.form.get('date_committee_met_requirements')?.updateValueAndValidity();
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    const reportId = this.reportId();
    this.initForm();

    // A deep copy of activeReport has to be made because the actual activeReport
    // object is set to read-only by the NgRx store.
    if (reportId) {
      this.report = Form1M.fromJSON(structuredClone(this.activeReport()));
      // Set the statusBy radio button based on form values

      this.signalForm().value.update((v) => {
        return {
          statusBy: this.report.affiliated_committee_name ? 'affiliation' : 'qualification',
          contactForm: v.contactForm,
          candidateOffices: this.getCandidateOffices(),
        };
      });
    }
  }

  private getCandidateOffices(): CandidateOfficeModels {
    const getOffice = (tag: F1MCandidateTag): CandidateOfficeModel => ({
      candidate_office: this.report[`${tag}_candidate_office`] ?? null,
      candidate_state: this.report[`${tag}_candidate_state`] ?? null,
      candidate_district: this.report[`${tag}_candidate_district`] ?? null,
    });

    return {
      I: getOffice('I'),
      II: getOffice('II'),
      III: getOffice('III'),
      IV: getOffice('IV'),
      V: getOffice('V'),
    };
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.cmservice.get('contact_affiliated').outerContact.set(null);
    f1mCandidateTags.forEach((tag) => this.cmservice.get(`contact_candidate_${tag}`).outerContact.set(null));
  }

  async getConfirmations(): Promise<boolean> {
    if (!this.report) return false;
    return this.confirmationService.confirmWithUser(
      this.form,
      this.contactConfigs,
      this.getContact.bind(this),
      this.getTemplateMap.bind(this),
      undefined,
      this.signalForm.candidateOffices().value(),
    );
  }

  getContact(contactKey: string) {
    if (this.report[contactKey as keyof Form1M]) {
      return this.report[contactKey as keyof Form1M] as Contact;
    }
    return null;
  }

  getTemplateMap(contactKey: string): TransactionTemplateMapType | undefined {
    return this.templateMapConfigs[contactKey];
  }

  initForm() {
    this.committeeTypeControl = this.form.get('committee_type');
    this.affiliatedContact = new AffiliatedContact(this);
    this.candidateContacts = f1mCandidateTags.map((tag: F1MCandidateTag) => new CandidateContact(tag, this));

    // Clear matching CANDIDATE ID form fields of error message when a duplicate is edited
    f1mCandidateTags.forEach((tag: F1MCandidateTag) => {
      (this.form.get(`${tag}_candidate_id_number`) as SubscriptionFormControl)?.addSubscription(() => {
        f1mCandidateTags
          .filter((t) => t !== tag)
          .forEach((t) => {
            const control = this.form.get(`${t}_candidate_id_number`);
            if (control?.invalid && control.errors && 'fecIdMustBeUnique' in control.errors) {
              this.form.get(`${t}_candidate_id_number`)?.updateValueAndValidity();
            }
          });
      });
    });
  }

  enableValidation(contacts: F1MContact[]) {
    contacts.forEach((contact: F1MContact) => contact.enableValidation());
  }

  disableValidation(contacts: F1MContact[]) {
    contacts.forEach((contact: F1MContact) => contact.disableValidation());
  }

  getReportPayload(): Form1M {
    const data = SchemaUtils.getFormValues(this.form, this.schema, this.formProperties);
    this.updateContactsWithForm();
    return Object.assign(this.report, data);
  }

  public override async submit(): Promise<void> {
    const confirmed = await this.getConfirmations();
    // if every confirmation was accepted
    if (confirmed) return super.submit(this.jump);
    else this.store.dispatch(singleClickEnableAction());
  }

  updateContactsWithForm() {
    Object.entries(this.contactConfigs).forEach(([contactKey, config]: [string, { [formField: string]: string }]) => {
      if (this.report[contactKey as keyof Form1M]) {
        const contact = this.report[contactKey as keyof Form1M] as Contact;
        const contactChanges = TransactionContactUtils.getContactChanges(
          this.form,
          contact,
          this.templateMapConfigs[contactKey],
          config,
        );
        contactChanges.forEach(([property, value]) => (contact[property as keyof Contact] = value as never));
      }
    });
  }

  override async submitForm(jump: 'continue' | void): Promise<void> {
    this.jump = jump ?? undefined;
    await submit(this.signalForm);
  }
}
