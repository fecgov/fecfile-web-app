import { Component, inject, Injector, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainFormBaseComponent } from 'app/reports/shared/main-form-base.component';
import { TransactionContactUtils } from 'app/shared/components/transaction-type-base/transaction-contact.utils';
import { Contact } from 'app/shared/models/contact.model';
import { Form1M } from 'app/shared/models/form-1m.model';
import { Report } from 'app/shared/models/report.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { Form1MService } from 'app/shared/services/form-1m.service';
import { blurActiveInput } from 'app/shared/utils/form.utils';
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
import { CandidateOfficeInputComponent } from '../../../shared/components/inputs/candidate-office-input/candidate-office-input.component';
import { NameInputComponent } from '../../../shared/components/inputs/name-input/name-input.component';
import { SaveCancelComponent } from '../../../shared/components/save-cancel/save-cancel.component';
import { AffiliatedContact, CandidateContact, F1MCandidateTag, f1mCandidateTags, F1MContact } from './contact';
import { ConfirmationWrapperService } from 'app/shared/services/confirmation-wrapper.service';
import { ReportContactLookupComponent } from 'app/shared/components/report-contact-lookup/report-contact-lookup.component';
import { ContactService } from 'app/shared/services/contact.service';
import { ContactModalComponent } from 'app/shared/components/contact-modal/contact-modal.component';
import { ContactManagementService } from 'app/shared/services/contact-management.service';

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
    CandidateOfficeInputComponent,
    SaveCancelComponent,
    ConfirmDialog,
    ContactModalComponent,
  ],
  styleUrl: './main-form.component.scss',
})
export class MainFormComponent extends MainFormBaseComponent implements OnInit, OnDestroy {
  readonly injector = inject(Injector);
  readonly cmservice = inject(ContactManagementService);
  protected override readonly reportService: Form1MService = inject(Form1MService);
  readonly contactService = inject(ContactService);
  protected readonly confirmationService = inject(ConfirmationWrapperService);

  readonly f1mCandidateTags = f1mCandidateTags;
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
    'I_candidate_office',
    'I_candidate_state',
    'I_candidate_district',
    'I_date_of_contribution',
    'II_candidate_id_number',
    'II_candidate_last_name',
    'II_candidate_first_name',
    'II_candidate_middle_name',
    'II_candidate_prefix',
    'II_candidate_suffix',
    'II_candidate_office',
    'II_candidate_state',
    'II_candidate_district',
    'II_date_of_contribution',
    'III_candidate_id_number',
    'III_candidate_last_name',
    'III_candidate_first_name',
    'III_candidate_middle_name',
    'III_candidate_prefix',
    'III_candidate_suffix',
    'III_candidate_office',
    'III_candidate_state',
    'III_candidate_district',
    'III_date_of_contribution',
    'IV_candidate_id_number',
    'IV_candidate_last_name',
    'IV_candidate_first_name',
    'IV_candidate_middle_name',
    'IV_candidate_prefix',
    'IV_candidate_suffix',
    'IV_candidate_office',
    'IV_candidate_state',
    'IV_candidate_district',
    'IV_date_of_contribution',
    'V_candidate_id_number',
    'V_candidate_last_name',
    'V_candidate_first_name',
    'V_candidate_middle_name',
    'V_candidate_prefix',
    'V_candidate_suffix',
    'V_candidate_office',
    'V_candidate_state',
    'V_candidate_district',
    'V_date_of_contribution',
    'date_of_original_registration',
    'date_of_51st_contributor',
    'date_committee_met_requirements',

    'statusBy',
  ];
  readonly schema = f1mSchema;
  readonly webprintURL = '/reports/f1m/web-print/';

  contactConfigs: { [contactKey: string]: { [formField: string]: string } } = {};
  templateMapConfigs: { [contactKey: string]: TransactionTemplateMapType } = {};

  committeeTypeControl: AbstractControl | null = null;
  statusByControl: SubscriptionFormControl | null = null;
  affiliatedContact: AffiliatedContact = {} as AffiliatedContact;
  candidateContacts: CandidateContact[] = [];

  report = new Form1M();

  override ngOnInit(): void {
    super.ngOnInit();
    if (!this.reportId) return;
    // A deep copy of activeReport has to be made because the actual activeReport
    // object is set to read-only by the NgRx store.
    this.report = Form1M.fromJSON(JSON.parse(JSON.stringify(this.activeReport())));

    this.initForm();

    // Set the statusBy radio button based on form values
    if (this.report.affiliated_committee_name) {
      this.statusByControl?.setValue('affiliation');
    } else {
      this.statusByControl?.setValue('qualification');
    }
  }

  async getConfirmations(): Promise<boolean> {
    if (!this.report) return false;
    return this.confirmationService.confirmWithUser(
      this.form,
      this.contactConfigs,
      this.getContact.bind(this),
      this.getTemplateMap.bind(this),
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
    this.statusByControl = this.form.get('statusBy') as SubscriptionFormControl;
    this.statusByControl?.addValidators(Validators.required);
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

    this.statusByControl?.addSubscription((value: 'affiliation' | 'qualification') => {
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
    this.statusByControl?.updateValueAndValidity();
  }

  enableValidation(contacts: F1MContact[]) {
    contacts.forEach((contact: F1MContact) => contact.enableValidation());
  }

  disableValidation(contacts: F1MContact[]) {
    contacts.forEach((contact: F1MContact) => contact.disableValidation());
  }

  getReportPayload(): Report {
    const formValues = Form1M.fromJSON(SchemaUtils.getFormValues(this.form, this.schema, this.formProperties));
    this.updateContactsWithForm(this.report, this.form);
    return Object.assign(this.report, formValues);
  }

  public override async save(jump: 'continue' | undefined = undefined): Promise<void> {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    if (this.form.invalid) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }

    const confirmed = await this.getConfirmations();
    // if every confirmation was accepted
    if (confirmed) super.save(jump);
    else this.store.dispatch(singleClickEnableAction());
  }

  updateContactsWithForm(report: Form1M, form: FormGroup) {
    Object.entries(this.contactConfigs).forEach(([contactKey, config]: [string, { [formField: string]: string }]) => {
      if (report[contactKey as keyof Form1M]) {
        const contact = report[contactKey as keyof Form1M] as Contact;
        const contactChanges = TransactionContactUtils.getContactChanges(
          form,
          contact,
          this.templateMapConfigs[contactKey],
          config,
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        contactChanges.forEach(([property, value]: [keyof Contact, any]) => {
          contact[property] = value as never;
        });
      }
    });
  }
}
