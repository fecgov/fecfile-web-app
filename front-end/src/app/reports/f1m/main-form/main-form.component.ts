import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { concatAll, from, Observable, of, reduce, takeUntil } from 'rxjs';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { schema as f1mSchema } from 'fecfile-validate/fecfile_validate_js/dist/F1M';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Form1M } from 'app/shared/models/form-1m.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { Form1MService } from 'app/shared/services/form-1m.service';
import { Report } from 'app/shared/models/report.model';
import { MainFormBaseComponent } from 'app/reports/shared/main-form-base.component';
import { Contact } from 'app/shared/models/contact.model';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { TransactionContactUtils } from 'app/shared/components/transaction-type-base/transaction-contact.utils';
import { AffiliatedContact, CandidateContact, F1MCandidateTag, f1mCandidateTags, F1MContact } from './contact';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
})
export class MainFormComponent extends MainFormBaseComponent implements OnInit {
  formProperties: string[] = [
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
  contactConfigs: { [contactKey: string]: { [formField: string]: string } } = {};
  templateMapConfigs: { [contactKey: string]: TransactionTemplateMapType } = {};
  schema = f1mSchema;
  webprintURL = '/reports/f1m/web-print/';
  templateMap = {
    street_1: 'street_1',
    street_2: 'street_2',
    city: 'city',
    state: 'state',
    zip: 'zip',
  } as TransactionTemplateMapType;

  committeeTypeControl: AbstractControl | null = null;
  statusByControl: AbstractControl | null = null;
  affiliatedContact: AffiliatedContact = {} as AffiliatedContact;
  candidateContacts: CandidateContact[] = [];
  excludeFecIds: string[] = [];
  excludeIds: string[] = [];

  report = new Form1M();

  constructor(
    protected override store: Store,
    protected override fb: FormBuilder,
    protected override reportService: Form1MService,
    protected override messageService: MessageService,
    protected override router: Router,
    protected override activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
  ) {
    super(store, fb, reportService, messageService, router, activatedRoute);
  }

  get confirmation$(): Observable<boolean> {
    if (!this.report) return of(false);
    return this.confirmWithUser(this.report, this.form);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((activeReport) => {
        if (this.reportId) {
          // A deep copy of activeReport has to be made because the actual activeReport
          // object is set to read-only by the NgRx store.
          this.report = Form1M.fromJSON(JSON.parse(JSON.stringify(activeReport)));

          // Set the statusBy radio button based on form values
          if (this.report.affiliated_committee_name) {
            this.form.get('statusBy')?.setValue('affiliation');
          } else {
            this.form.get('statusBy')?.setValue('qualification');
          }

          // If this is an edit, update the lookup ids to exclude
          if (this.report.id) {
            if (this.report.affiliated_committee_name) {
              if (this.report?.contact_affiliated?.committee_id)
                this.excludeFecIds.push(this.report.contact_affiliated.committee_id);
              if (this.report.contact_affiliated_id) this.excludeIds.push(this.report.contact_affiliated_id);
            } else {
              f1mCandidateTags.forEach((tag: F1MCandidateTag) => {
                if (this.report[`contact_candidate_${tag}` as keyof Form1M].candidate_id)
                  this.excludeFecIds.push(this.report[`contact_candidate_${tag}` as keyof Form1M].candidate_id);
                if (this.report[`contact_candidate_${tag}_id` as keyof Form1M])
                  this.excludeIds.push(this.report[`contact_candidate_${tag}_id` as keyof Form1M]);
              });
            }
          }
        }
      });

    this.committeeTypeControl = this.form.get('committee_type');
    this.statusByControl = this.form.get('statusBy');
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

    (this.form.get('statusBy') as SubscriptionFormControl)?.addSubscription(
      (value: 'affiliation' | 'qualification') => {
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
        this.excludeIds = [];
        this.excludeFecIds = [];
        this.form.get('date_of_original_registration')?.updateValueAndValidity();
        this.form.get('date_of_51st_contributor')?.updateValueAndValidity();
        this.form.get('date_committee_met_requirements')?.updateValueAndValidity();
      },
    );
    this.form.get('statusBy')?.updateValueAndValidity();
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

  public override save(jump: 'continue' | undefined = undefined) {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    if (this.form.invalid) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }

    this.confirmation$.subscribe((confirmed: boolean) => {
      // if every confirmation was accepted
      if (confirmed) super.save(jump);
      else this.store.dispatch(singleClickEnableAction());
    });
  }

  confirmWithUser(report: Form1M, form: FormGroup) {
    const confirmations$ = Object.entries(this.contactConfigs)
      .map(([contactKey, config]: [string, { [formField: string]: string }]) => {
        if (report[contactKey as keyof Form1M]) {
          const contact = report[contactKey as keyof Form1M] as Contact;
          if (!contact.id) {
            return TransactionContactUtils.getCreateTransactionContactConfirmationMessage(
              contact.type,
              form,
              this.templateMapConfigs[contactKey],
              contactKey,
              'By saving this report',
            );
          }
          const changes = TransactionContactUtils.getContactChanges(
            form,
            contact,
            this.templateMapConfigs[contactKey],
            config,
          );
          if (changes.length > 0) {
            return TransactionContactUtils.getContactChangesMessage(contact, changes);
          }
        }
        return '';
      })
      .filter((message) => !!message)
      .map((message: string) => {
        return TransactionContactUtils.displayConfirmationPopup(message, this.confirmationService, 'dialog');
      });

    return from([of(true), ...confirmations$]).pipe(
      concatAll(),
      reduce((accumulator, confirmed) => accumulator && confirmed),
    );
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

  /**
   * Generate a list of candidate contact ids that are currently entered in the F1M
   * form so that we can check for duplicates and screen them from the lookup
   * or raise a validation error on the screen.
   * @param excludeContactTag - values: I, II, III, IV, or V
   * @returns string[] - list of contact ids currently selected by user for Qualifications
   */
  getSelectedContactIds(excludeContactTag: F1MCandidateTag | undefined = undefined) {
    return f1mCandidateTags
      .filter((tag: F1MCandidateTag) => tag !== excludeContactTag)
      .map((tag: F1MCandidateTag) => this.form.get(`${tag}_candidate_id_number`)?.value)
      .filter((id) => !!id);
  }
}
