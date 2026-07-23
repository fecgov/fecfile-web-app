import { Component, computed, effect, inject, input, model, OnInit, output, signal, viewChild } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToUpperDirective } from 'app/shared/directives/to-upper.directive';
import { candidatePatternMessage, committeePatternMessage } from 'app/shared/models';
import { ContactService } from 'app/shared/services/contact.service';
import { blurActiveInput, printFormErrors } from 'app/shared/utils/form.utils';
import { CountryCodeLabels, LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { Select } from 'primeng/select';
import { takeUntil } from 'rxjs';
import {
  CandidateOfficeTypes,
  Contact,
  ContactTypeLabels,
  ContactTypes,
  hasFecId,
  isEntity,
  isPerson,
} from '../../models/contact.model';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from '../fec-international-phone-input/fec-international-phone-input.component';
import { FormComponent } from '../form.component';
import { CandidateOfficeInputComponent } from '../inputs/candidate-office-input/candidate-office-input.component';
import { SearchableSelectComponent } from '../searchable-select/searchable-select.component';
import { TransactionContactUtils } from '../transaction-type-base/transaction-contact.utils';
import { ContactTransactionTableComponent } from './contact-transaction-table/contact-transaction-table.component';
import { effectOnceIf } from 'ngxtension/effect-once-if';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: [],
  imports: [
    Dialog,
    ReactiveFormsModule,
    ContactLookupComponent,
    InputText,
    ErrorMessagesComponent,
    Select,
    FecInternationalPhoneInputComponent,
    CandidateOfficeInputComponent,
    ButtonDirective,
    Ripple,
    SearchableSelectComponent,
    ToUpperDirective,
    ContactTransactionTableComponent,
  ],
  providers: [SearchableSelectComponent],
})
export class ContactDialogComponent extends FormComponent implements OnInit {
  private readonly contactService = inject(ContactService);
  protected readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  readonly contact = model<Contact>();
  readonly visible = model(false);
  readonly contactTypeOptions = input<PrimeOptions>(LabelUtils.getPrimeOptions(ContactTypeLabels));
  readonly showHistory = input(false);
  readonly headerTitle = input<string>();
  readonly defaultCandidateOffice = input<CandidateOfficeTypes>();

  readonly detailVisibleChange = output<boolean>();
  readonly savedContact = output<Contact>();

  readonly ContactTypes = ContactTypes;

  readonly contactLookup = viewChild.required(ContactLookupComponent);

  form: FormGroup = this.fb.group(
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

  readonly isNewItem = computed(() => !this.contact()?.id);
  readonly contactType = signal<ContactTypes>(ContactTypes.INDIVIDUAL);
  readonly isEntity = computed(() => isEntity(this.contactType()));
  readonly isPerson = computed(() => isPerson(this.contactType()));

  readonly stateOptions = computed(() =>
    this.contactType() === ContactTypes.CANDIDATE
      ? LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary())
      : LabelUtils.getPrimeOptions(StatesCodeLabels),
  );
  readonly countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);

  candidateDistrictOptions: PrimeOptions = [];
  readonly dialogVisible = signal(false);

  readonly candidatePatternMessage = candidatePatternMessage;
  readonly committeePatternMessage = committeePatternMessage;

  constructor() {
    super();
    effect(() => {
      this.contactTypeChanged(this.contactType());
    });
  }

  ngOnInit(): void {
    this.form
      ?.get('country')
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
      ?.get('candidate_state')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (!!value && this.form.get('candidate_office')?.value === CandidateOfficeTypes.HOUSE) {
          this.candidateDistrictOptions = LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels(value));
        } else {
          this.candidateDistrictOptions = [];
        }
      });

    // If there is a default candidate office (e.g. 'P') set, then make the
    // candidate office select read-only disabled.
    if (this.defaultCandidateOffice()) {
      this.form.get('candidate_office')?.disable();
    }

    this.contactTypeChanged(this.contactType());
  }

  /**
   * On ngOnInit and when a user changes the selection of the ContactType for the contact
   * entry form (as known by the emitter from the contact-lookup component), update the necessary
   * FormControl elements for the ContactType selected by the user.
   * @param contactType
   */
  contactTypeChanged(contactType: ContactTypes) {
    if (!this.contact()) this.contact.set(new Contact());

    // The type form control is not displayed on the form page because we are
    // displaying the contact lookup component which operates independently, so
    // we keep the 'type' value on the contact dialog form up-to-date in the background.
    this.form.get('type')?.setValue(contactType);

    const schema = ContactService.getSchemaByType(contactType);
    SchemaUtils.addJsonSchemaValidators(this.form, schema, true);
    switch (contactType) {
      case ContactTypes.CANDIDATE:
        this.form.get('candidate_id')?.addAsyncValidators(this.contactService.getFecIdValidator(this.contact()!.id));
        break;
      case ContactTypes.COMMITTEE:
        this.form.get('committee_id')?.addAsyncValidators(this.contactService.getFecIdValidator(this.contact()!.id));
        break;
    }
    this.form.updateValueAndValidity();

    // Clear out non-schema form values
    const formValues: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    const schemaProperties: string[] = SchemaUtils.getSchemaProperties(schema);
    Object.keys(this.form.controls).forEach((property: string) => {
      if (!schemaProperties.includes(property)) {
        formValues[property] = null;
      }
    });
    this.form.patchValue(formValues);
  }

  public openDialog() {
    this.resetForm();
    const contact = this.contact()!;
    this.form.patchValue(contact);
    if (contact.id) {
      // Update the value of the Contact Type select box in the Contact Lookup
      // component because the Contact Dialog is hidden and not destroyed on close,
      // so we need to directly update the lookup "type" form control value
      this.contactLookup().contactType.set(contact.type);
    }
    this.dialogVisible.set(true);
  }

  public closeDialog(visibleChangeFlag = false) {
    if (!visibleChangeFlag) {
      this.detailVisibleChange.emit(false);
      this.visible.set(false);
      this.dialogVisible.set(false);
    }
  }

  readonly showSearchBox = computed(() => hasFecId(this.contactType()));

  private resetForm() {
    this.form.reset();
    this.form.get('country')?.setValue(this.countryOptions[0]['value']);
    this.form.get('state')?.setValue(null);
    this.contactLookup().contactType.set(this.contactType());
    if (this.defaultCandidateOffice) {
      this.form.get('candidate_office')?.setValue(this.defaultCandidateOffice);
    }
    this.formSubmitted = false;
  }

  updateContact(contact: Contact) {
    this.contact.set(contact);
    this.contactType.set(contact.type);
    this.form.markAllAsDirty();
    this.form.patchValue(contact);
  }

  override async submit(jump: 'continue' | void): Promise<void> {
    if (jump === 'continue') return this.saveContact(false);
    if (this.headerTitle() || this.isNewItem()) return this.saveContact();
    return this.confirmPropagation();
  }

  confirmPropagation() {
    const changes = Object.entries(this.form.controls)
      .map(([field, control]: [string, AbstractControl]) => {
        const contactValue = this.contact()![field as keyof Contact];
        if (control?.value !== contactValue) {
          return [field, control.value];
        }
        return undefined;
      })
      .filter((change) => !!change) as [string, any][]; // eslint-disable-line @typescript-eslint/no-explicit-any
    const changesMessage = TransactionContactUtils.getContactChangesMessage(this.contact()!, changes);
    this.confirmationService.confirm({
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      message: changesMessage,
      acceptLabel: 'Continue',
      rejectLabel: 'Cancel',
      accept: () => {
        this.saveContact();
      },
    });
  }

  public async saveContact(closeDialog = true) {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      printFormErrors(this.form);
      return;
    }
    const payload: Contact = Contact.fromJSON({
      ...this.contact(),
      ...SchemaUtils.getFormValues(this.form, ContactService.getSchemaByType(this.contactType())),
      type: this.contactType,
    });

    const contact = await (payload.id ? this.contactService.update(payload) : this.contactService.create(payload));
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: payload.id ? 'Contact Updated' : 'Contact Created',
      life: 3000,
    });

    this.savedContact.emit(contact);

    if (closeDialog) {
      this.closeDialog();
    }
    this.resetForm();
  }
}
