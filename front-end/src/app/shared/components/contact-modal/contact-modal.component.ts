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
} from './individual-contact-form/individual-contact-form.component';
import {
  CandidateContactFormComponent,
  CandidateContactData,
  defaultCandidateData,
  getCandidateSchema,
} from './candidate-contact-form/candidate-contact-form.component';
import { apply, form, hidden, submit } from '@angular/forms/signals';
import { SelectInputComponent } from '../signal-inputs/select-input/select-input.component';
import {
  CommitteeContactData,
  CommitteeContactFormComponent,
  getCommitteeSchema,
  defaultCommitteeData,
} from './committee-contact-form/committee-contact-form.component';
import {
  defaultOrganizationData,
  OrganizationContactData,
  OrganizationContactFormComponent,
  organizationSchema,
} from './organization-contact-form/organization-contact-form.component';
import { ContactService } from 'app/shared/services/contact.service';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { flattenPayload } from 'app/shared/utils/schema-signal.utils';

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
    SelectInputComponent,
    CommitteeContactFormComponent,
    OrganizationContactFormComponent,
  ],
  providers: [MessageService],
})
export class ContactModalComponent {
  private readonly cookieService = inject(CookieService);
  private readonly contactService = inject(ContactService);
  private readonly messageService = inject(MessageService);
  public readonly router = inject(Router);
  readonly visible = model.required<boolean>();

  readonly availableContactTypes = input.required<PrimeOptions>();
  readonly contactType = model.required<ContactTypes>();
  readonly contactCreated = output<Contact>();

  readonly formModel = signal<ContactData>(initialData);
  readonly contactForm = form(this.formModel, (schemaPath) => {
    const schemaMap = {
      [ContactTypes.CANDIDATE]: getCandidateSchema(this.cookieService),
      [ContactTypes.INDIVIDUAL]: individualSchema,
      [ContactTypes.COMMITTEE]: getCommitteeSchema(this.cookieService),
      [ContactTypes.ORGANIZATION]: organizationSchema,
    };
    Object.values(ContactTypes).forEach((type) => {
      const subFormPath = (schemaPath as any)[type];
      const targetSchema = schemaMap[type];
      if (subFormPath && targetSchema) {
        hidden(subFormPath, ({ valueOf }) => valueOf(schemaPath.type) !== type);
        apply(subFormPath, targetSchema as any);
      }
    });
  });

  constructor() {
    effect(() => this.contactForm.type().value.set(this.contactType()));
  }

  submitForm() {
    submit(this.contactForm, async () => {
      try {
        const payload = this.buildContact();
        if (!payload) throw new Error('Error creating contact');
        const contact = await this.contactService.create(payload);
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

    return Contact.fromJSON(payload);
  }
}
