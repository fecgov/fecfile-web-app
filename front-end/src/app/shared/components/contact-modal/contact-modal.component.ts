import { Component, computed, effect, inject, input, OnInit, untracked } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactService } from 'app/shared/services/contact.service';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { CountryCodeLabels, LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { ConfirmationService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { Select } from 'primeng/select';
import { takeUntil } from 'rxjs';
import { CandidateOfficeTypes, Contact, ContactTypes } from '../../models/contact.model';
import { DestroyerComponent } from '../app-destroyer.component';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from '../fec-international-phone-input/fec-international-phone-input.component';
import { CandidateOfficeInputComponent } from '../inputs/candidate-office-input/candidate-office-input.component';
import { ContactManagementService } from 'app/shared/services/contact-management.service';
import { ContactSearchComponent } from '../contact-search/contact-search.component';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss'],
  imports: [
    Dialog,
    ReactiveFormsModule,
    ContactSearchComponent,
    InputText,
    ErrorMessagesComponent,
    Select,
    FecInternationalPhoneInputComponent,
    CandidateOfficeInputComponent,
    ButtonDirective,
    Ripple,
    ConfirmDialog,
  ],
})
export class ContactModalComponent extends DestroyerComponent implements OnInit {
  readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  readonly cmservice = inject(ContactManagementService);
  protected readonly confirmationService = inject(ConfirmationService);
  public readonly router = inject(Router);

  readonly showHistory = input(false);

  readonly form: FormGroup = this.fb.group(
    SchemaUtils.getFormGroupFields([
      ...new Set([
        ...SchemaUtils.getSchemaProperties(contactIndividualSchema),
        ...SchemaUtils.getSchemaProperties(contactCandidateSchema),
        ...SchemaUtils.getSchemaProperties(contactCommitteeSchema),
        ...SchemaUtils.getSchemaProperties(contactOrganizationSchema),
      ]),
    ]),
    { updateOn: 'blur' },
  );
  formSubmitted = false;

  readonly manager = computed(() => this.cmservice.activeManager());

  readonly stateOptions = computed(() => {
    if (this.manager().contactType() === ContactTypes.CANDIDATE) {
      return LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
    } else {
      return LabelUtils.getPrimeOptions(StatesCodeLabels);
    }
  });
  readonly countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);
  readonly candidateStateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
  candidateDistrictOptions: PrimeOptions = [];
  emptyMessage = 'No data available in table';

  readonly sortableHeaders: { field: string; label: string }[] = [
    { field: 'transaction_type_identifier', label: 'Type' },
    { field: 'form_type', label: 'Form' },
    { field: 'report_code_label', label: 'Report' },
    { field: 'date', label: 'Date' },
    { field: 'amount', label: 'Amount' },
  ];

  readonly isCandidate = computed(() => this.manager().contactType() === ContactTypes.CANDIDATE);
  readonly isIndividual = computed(() => this.manager().contactType() === ContactTypes.INDIVIDUAL);
  readonly isCommittee = computed(() => this.manager().contactType() === ContactTypes.COMMITTEE);
  readonly isOrganization = computed(() => this.manager().contactType() === ContactTypes.ORGANIZATION);

  constructor() {
    super();
    effect(() => {
      const contact = this.manager().contact();

      untracked(() => {
        this.updateContactType();
        this.form.patchValue(contact, { emitEvent: false });
      });
    });

    effect(() => {
      if (!this.cmservice.showDialog()) this.reset();
    });
  }

  ngOnInit(): void {
    this.form
      .get('country')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (value !== 'USA') {
          this.form.patchValue({
            state: 'ZZ',
          });
          // ajv does not un-require zip when country is not USA
          this.form.patchValue({ zip: this.form.get('zip')?.value ?? '' });
          this.form.get('state')?.disable();
        } else {
          this.form.patchValue({ zip: this.form.get('zip')?.value ?? null });
          this.form.get('state')?.enable();
        }
      });

    this.form
      .get('candidate_state')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (!!value && this.form.get('candidate_office')?.value === CandidateOfficeTypes.HOUSE) {
          this.candidateDistrictOptions = LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels(value));
        } else {
          this.candidateDistrictOptions = [];
        }
      });

    this.updateContactType();
  }

  private reset() {
    this.form.markAsUntouched();
    this.form.markAsPristine();
    this.formSubmitted = false;
  }

  private updateContactType() {
    const contactType = this.manager().contactType();

    // The type form control is not displayed on the form page because we are
    // displaying the contact lookup component which operates independently, so
    // we keep the 'type' value on the contact dialog form up-to-date in the background.
    this.form.get('type')?.setValue(contactType);

    const schema = ContactService.getSchemaByType(contactType);
    SchemaUtils.addJsonSchemaValidators(this.form, schema, true);
    switch (contactType) {
      case ContactTypes.CANDIDATE:
        this.form
          .get('candidate_id')
          ?.addAsyncValidators(this.contactService.getFecIdValidator(this.manager().contact().id));
        break;
      case ContactTypes.COMMITTEE:
        this.form
          .get('committee_id')
          ?.addAsyncValidators(this.contactService.getFecIdValidator(this.manager().contact().id));
        break;
    }
    this.form.updateValueAndValidity();
  }

  saveContact() {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    this.form.updateValueAndValidity();

    if (!this.form.valid) {
      return;
    }

    const contact: Contact = Contact.fromJSON({
      ...this.manager().contact(),
      ...SchemaUtils.getFormValues(this.form, ContactService.getSchemaByType(this.manager().contactType())),
    });
    contact.type = this.manager().contactType();
    this.manager().contact.set(contact);

    this.cmservice.showDialog.set(false);
    this.manager().outerContact.set(contact);
    this.formSubmitted = false;
  }
}
