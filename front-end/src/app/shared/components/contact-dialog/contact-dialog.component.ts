import { Component, computed, effect, inject, input, model, output, signal, viewChild } from '@angular/core';
import { ContactService } from 'app/shared/services/contact.service';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { CandidateOfficeTypes, Contact, ContactTypes, hasFecId } from '../../models/contact.model';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { SearchableSelectComponent } from '../searchable-select/searchable-select.component';
import {
  apply,
  applyWhen,
  disabled,
  form,
  FormField,
  hidden,
  readonly,
  required,
  submit,
} from '@angular/forms/signals';
import {
  CandidateContactData,
  CandidateContactFormComponent,
  candidateSchema,
  populateCandidate,
} from './candidate-contact-form/candidate-contact-form.component';
import {
  CommitteeContactData,
  CommitteeContactFormComponent,
  committeeSchema,
  populateCommittee,
} from './committee-contact-form/committee-contact-form.component';
import {
  IndividualContactData,
  IndividualContactFormComponent,
  individualSchema,
  populateIndividual,
} from './individual-contact-form/individual-contact-form.component';
import {
  OrganizationContactData,
  OrganizationContactFormComponent,
  organizationSchema,
  populateOrganization,
} from './organization-contact-form/organization-contact-form.component';
import { DialogComponent } from '../dialog/dialog.component';
import { SelectInput } from '../signal-inputs/select-input/select.input';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ContactTransactionTableComponent } from './contact-transaction-table/contact-transaction-table.component';
import { flattenPayload } from 'app/shared/utils/signal-schema.utils';
import { TransactionContactUtils } from '../transaction-type-base/transaction-contact.utils';
import { SignalFormComponent } from '../signal-form/signal-form.component';

interface ContactData {
  type: ContactTypes;
  [ContactTypes.CANDIDATE]: CandidateContactData;
  [ContactTypes.INDIVIDUAL]: IndividualContactData;
  [ContactTypes.COMMITTEE]: CommitteeContactData;
  [ContactTypes.ORGANIZATION]: OrganizationContactData;
}

const initialData: ContactData = {
  type: ContactTypes.INDIVIDUAL,
  [ContactTypes.CANDIDATE]: populateCandidate(),
  [ContactTypes.INDIVIDUAL]: populateIndividual(),
  [ContactTypes.COMMITTEE]: populateCommittee(),
  [ContactTypes.ORGANIZATION]: populateOrganization(),
};

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss'],
  imports: [
    DialogComponent,
    CandidateContactFormComponent,
    CommitteeContactFormComponent,
    IndividualContactFormComponent,
    OrganizationContactFormComponent,
    SelectInput,
    FormField,
    ContactTransactionTableComponent,
  ],
  providers: [SearchableSelectComponent],
})
export class ContactDialogComponent extends SignalFormComponent<ContactData> {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly contactService = inject(ContactService);
  private readonly messageService = inject(MessageService);

  readonly visible = model.required<boolean>();

  readonly availableContactTypes = input.required<PrimeOptions>();
  readonly contact = input<Contact>();
  readonly showHistory = input(false);
  readonly headerTitle = input<string>();
  readonly defaultCandidateOffice = input<CandidateOfficeTypes>();

  readonly savedContact = output<Contact>();
  readonly contactLookup = viewChild.required(ContactLookupComponent);

  readonly model = signal<ContactData>(initialData);
  readonly form = form(this.model, (schemaPath) => {
    required(schemaPath.type);
    readonly(schemaPath.type, () => this.availableContactTypes().length < 2);
    hidden(schemaPath.CAN, ({ valueOf }) => valueOf(schemaPath.type) !== ContactTypes.CANDIDATE);
    apply(schemaPath.CAN, candidateSchema);

    hidden(schemaPath.IND, ({ valueOf }) => valueOf(schemaPath.type) !== ContactTypes.INDIVIDUAL);
    apply(schemaPath.IND, individualSchema);

    hidden(schemaPath.COM, ({ valueOf }) => valueOf(schemaPath.type) !== ContactTypes.COMMITTEE);
    apply(schemaPath.COM, committeeSchema);

    hidden(schemaPath.ORG, ({ valueOf }) => valueOf(schemaPath.type) !== ContactTypes.ORGANIZATION);
    apply(schemaPath.ORG, organizationSchema);

    applyWhen(
      schemaPath.CAN.office.candidate_office,
      () => !!this.defaultCandidateOffice(),
      (office) => {
        disabled(office);
      },
    );
  });

  readonly isNewItem = computed(() => !this.contact()?.id);
  readonly showSearchBox = computed(() => hasFecId(this.form.type().value()));
  readonly dialogVisible = signal(false);

  constructor() {
    super();
    effect(() => {
      const defaultCandidateOffice = this.defaultCandidateOffice();
      if (defaultCandidateOffice) this.form.CAN.office.candidate_office().value.set(defaultCandidateOffice);
    });
    effect(() => {
      const contact = this.contact();
      this.form().reset({
        type: contact?.type ?? this.getFromAvailable(),
        [ContactTypes.CANDIDATE]: populateCandidate(contact),
        [ContactTypes.INDIVIDUAL]: populateIndividual(contact),
        [ContactTypes.COMMITTEE]: populateCommittee(contact),
        [ContactTypes.ORGANIZATION]: populateOrganization(contact),
      });
    });

    effect(() => {
      const types = this.availableContactTypes();
      const currentType = this.form.type().value();
      if (types.some((t) => t.value === currentType)) return;
      this.form.type().value.set(types[0].value as ContactTypes);
    });
  }

  private getFromAvailable(): ContactTypes {
    const types = this.availableContactTypes();
    const currentType = this.form.type().value();
    if (types.some((t) => t.value === currentType)) return currentType;
    return types[0].value as ContactTypes;
  }

  submitForm() {
    submit(this.form, {
      ignoreValidators: 'none',
      action: async () => {
        try {
          const payload = this.buildContact();
          if (!payload) throw new Error('Error creating contact');
          if (this.isNewItem()) this.createContact(payload);
          else this.confirmUpdate(payload);
        } catch {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There was an error creating the contact',
            life: 3000,
          });
        }
      },
      onInvalid: (field) => {
        const firstError = field().errorSummary()[0];
        firstError?.fieldTree().focusBoundControl();
        console.log('error', firstError);
      },
    });
  }

  confirmUpdate(payload: Contact) {
    const contact = this.contact()!;
    const changes = Object.entries(payload).filter(([key, value]) => value !== contact[key as keyof Contact]);

    const changesMessage = TransactionContactUtils.getContactChangesMessage(contact, changes);
    this.confirmationService.confirm({
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      message: changesMessage,
      acceptLabel: 'Continue',
      rejectLabel: 'Cancel',
      accept: () => {
        this.updateContact(payload);
      },
    });
  }

  async updateContact(payload: Contact) {
    const contact = await this.contactService.update(payload);
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Contact updated',
    });

    this.savedContact.emit(contact);
    this.form().reset({ ...initialData, type: this.form.type().value() });
    this.visible.set(false);
  }

  async createContact(payload: Contact) {
    const contact = await this.contactService.create(payload);
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Contact created',
    });

    this.savedContact.emit(contact);
    this.form().reset({ ...initialData, type: this.form.type().value() });
    this.visible.set(false);
  }

  private buildContact() {
    const currentType = this.form.type().value();
    const activeData = this.form[currentType]().value();

    const payload = {
      type: currentType,
      ...flattenPayload(activeData),
    };

    const contact = Contact.fromJSON(payload);
    if (contact.id === null) contact.id = undefined;
    return contact;
  }
}
