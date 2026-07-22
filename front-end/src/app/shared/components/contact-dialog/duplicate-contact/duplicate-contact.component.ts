import { Component, computed, inject, input, output, resource, signal } from '@angular/core';
import { Contact, ContactTypes, hasFecId } from 'app/shared/models/contact.model';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ContactService } from 'app/shared/services/contact.service';
import { AddressPipe } from '../../../pipes/address.pipe';

type ValidatingFields = Partial<Pick<Contact, 'name' | 'first_name' | 'last_name' | 'candidate_id' | 'committee_id'>>;

@Component({
  selector: 'app-duplicate-contact',
  imports: [ButtonModule, ProgressSpinnerModule, AddressPipe],
  templateUrl: './duplicate-contact.component.html',
  styleUrl: './duplicate-contact.component.scss',
})
export class DuplicateContactComponent {
  private readonly contactService = inject(ContactService);
  readonly type = input.required<ContactTypes>();
  readonly data = input.required<ValidatingFields>();
  readonly useContact = output<Contact>();

  readonly hideDuplicateWarning = signal(false);
  readonly checkingForDuplicate = signal(false);

  readonly hasFecId = computed(() => hasFecId(this.type()));

  closeDuplicateWarning() {}

  readonly validEntry = computed(() => {
    const type = this.type();
    const { candidate_id, committee_id, name, first_name, last_name } = this.data();
    if (type === ContactTypes.CANDIDATE) {
      if (candidate_id?.length !== 9) return false;
    } else if (type === ContactTypes.COMMITTEE) {
      if (committee_id?.length !== 9) return false;
    } else if (type === ContactTypes.ORGANIZATION) {
      if (name === '') return false;
    } else if (first_name === '' || last_name === '') return false;
    return true;
  });
  readonly duplicateCheck = resource({
    params: () => {
      if (!this.validEntry()) return null;
      return this.data();
    },
    loader: async ({ params, abortSignal }) => {
      if (!params) return [];
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (abortSignal.aborted) return [];
      return this.contactService.checkForDuplicates(params, this.type(), abortSignal);
    },
    defaultValue: [],
  });
}
