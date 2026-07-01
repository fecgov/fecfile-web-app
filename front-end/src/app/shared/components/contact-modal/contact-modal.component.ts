import { Component, effect, inject, input, model, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { Contact, ContactTypes } from '../../models/contact.model';
import { DialogComponent } from '../dialog/dialog.component';
import { FormsModule } from '@angular/forms';
import {
  IndividualContactFormComponent,
  IndividualContactData,
  defaultIndividualData,
  individualSchema,
  populateIndividual,
} from './individual-contact-form/individual-contact-form.component';
import {
  CandidateContactFormComponent,
  CandidateContactData,
  defaultCandidateData,
  populateCandidate,
  candidateSchema,
} from './candidate-contact-form/candidate-contact-form.component';
import { apply, form, hidden, submit, FormField } from '@angular/forms/signals';
import { SelectInput } from '../signal-inputs/select-input/select.input';
import {
  CommitteeContactData,
  CommitteeContactFormComponent,
  defaultCommitteeData,
  populateCommittee,
  committeeSchema,
} from './committee-contact-form/committee-contact-form.component';
import {
  defaultOrganizationData,
  OrganizationContactData,
  OrganizationContactFormComponent,
  organizationSchema,
  populateOrganization,
} from './organization-contact-form/organization-contact-form.component';
import { ContactService } from 'app/shared/services/contact.service';
import { MessageService } from 'primeng/api';
import { flattenPayload } from 'app/shared/utils/signal-schema.utils';

interface ContactData {
  type: ContactTypes | '';
  [ContactTypes.CANDIDATE]: CandidateContactData;
  [ContactTypes.INDIVIDUAL]: IndividualContactData;
  [ContactTypes.COMMITTEE]: CommitteeContactData;
  [ContactTypes.ORGANIZATION]: OrganizationContactData;
}

const initialData: ContactData = {
  type: '',
  [ContactTypes.CANDIDATE]: defaultCandidateData,
  [ContactTypes.INDIVIDUAL]: defaultIndividualData,
  [ContactTypes.COMMITTEE]: defaultCommitteeData,
  [ContactTypes.ORGANIZATION]: defaultOrganizationData,
};

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss'],
  imports: [
    DialogComponent,
    FormsModule,
    IndividualContactFormComponent,
    CandidateContactFormComponent,
    SelectInput,
    CommitteeContactFormComponent,
    OrganizationContactFormComponent,
    FormField,
  ],
  providers: [MessageService],
})
export class ContactModalComponent {
  private readonly contactService = inject(ContactService);
  private readonly messageService = inject(MessageService);
  public readonly router = inject(Router);
  readonly visible = model.required<boolean>();

  readonly availableContactTypes = input.required<PrimeOptions>();
  readonly contactType = model.required<ContactTypes>();
  readonly contact = input<Contact>();
  readonly contactCreated = output<Contact>();

  readonly formModel = signal<ContactData>(initialData);
  readonly contactForm = form(this.formModel, (schemaPath) => {
    hidden(schemaPath.CAN, ({ valueOf }) => valueOf(schemaPath.type) !== ContactTypes.CANDIDATE);
    apply(schemaPath.CAN, candidateSchema);

    hidden(schemaPath.IND, ({ valueOf }) => valueOf(schemaPath.type) !== ContactTypes.INDIVIDUAL);
    apply(schemaPath.IND, individualSchema);

    hidden(schemaPath.COM, ({ valueOf }) => valueOf(schemaPath.type) !== ContactTypes.COMMITTEE);
    apply(schemaPath.COM, committeeSchema);

    hidden(schemaPath.ORG, ({ valueOf }) => valueOf(schemaPath.type) !== ContactTypes.ORGANIZATION);
    apply(schemaPath.ORG, organizationSchema);
  });

  constructor() {
    effect(() => this.contactForm.type().value.set(this.contactType()));
    effect(() => {
      const contact = this.contact();
      if (!contact) return;
      this.contactForm().reset({
        type: contact.type!,
        [ContactTypes.CANDIDATE]: populateCandidate(contact),
        [ContactTypes.INDIVIDUAL]: populateIndividual(contact),
        [ContactTypes.COMMITTEE]: populateCommittee(contact),
        [ContactTypes.ORGANIZATION]: populateOrganization(contact),
      });
    });
  }

  submitForm() {
    submit(this.contactForm, {
      ignoreValidators: 'none',
      action: async () => {
        try {
          const payload = this.buildContact();
          if (!payload) throw new Error('Error creating contact');
          const contact = await (this.contact()
            ? this.contactService.update(payload)
            : this.contactService.create(payload));
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Contact created',
          });
          this.contactCreated.emit(contact);
          this.contactForm().reset({ ...initialData, type: this.contactType() });
          this.visible.set(false);
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

  private buildContact() {
    const currentType = this.contactForm.type().value();
    if (currentType === '') return null;
    const activeData = this.contactForm[currentType]().value();

    const payload = {
      type: currentType,
      ...flattenPayload(activeData),
    };

    const contact = Contact.fromJSON(payload);
    if (contact.id === null) contact.id = undefined;
    return contact;
  }
}
