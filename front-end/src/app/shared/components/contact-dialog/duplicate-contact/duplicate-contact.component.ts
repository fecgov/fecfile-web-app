import { Component, computed, input, output, signal } from '@angular/core';
import { Contact, ContactTypes, hasFecId } from 'app/shared/models/contact.model';
import { StatePipe } from '../../../pipes/state.pipe';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

function toFullName(data: { last_name?: string; first_name?: string }): string {
  return data.last_name && data.first_name ? `${data.last_name}, ${data.first_name}` : '';
}

interface ValidatingFields {
  name: string;
  first_name: string;
  last_name: string;
  candidate_id: string;
  committee_id: string;
}

const blankData = { first_name: '', last_name: '', name: '', candidate_id: '', committee_id: '' };
const propertyMap = { CAN: 'candidate_id', COM: 'committee_id', ORG: 'name' } as const;

@Component({
  selector: 'app-duplicate-contact',
  imports: [StatePipe, ButtonModule, ProgressSpinnerModule],
  templateUrl: './duplicate-contact.component.html',
  styleUrl: './duplicate-contact.component.scss',
})
export class DuplicateContactComponent {
  readonly existingContacts = input.required<Contact[]>();
  readonly type = input.required<ContactTypes>();
  readonly useContact = output<Contact>();

  readonly hideDuplicateWarning = signal(false);
  readonly potentialDuplicates = computed(() => this.existingContacts().filter((c) => this.checkForMatch(c)));

  readonly closeDuplicateWarning = () => this.hideDuplicateWarning.set(true);
  readonly hasFecId = computed(() => hasFecId(this.type()));

  readonly checkingForDuplicate = signal(false);
  private currentInputValues: ValidatingFields = { ...blankData };
  private readonly debouncedData = signal<ValidatingFields>({ ...blankData });
  readonly checkedValue = computed(() => {
    const data = this.debouncedData();
    const type = this.type();
    if (type === ContactTypes.INDIVIDUAL) {
      return toFullName(data);
    }
    return data[propertyMap[type]];
  });
  readonly validEntry = computed(() => this.checkedValue().trim() !== '');

  private debounceTimer: string | number | NodeJS.Timeout | undefined = undefined;
  updateCheckedData(event: Event, fieldName: keyof ValidatingFields) {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    const value = (event.target as HTMLInputElement).value;
    this.currentInputValues[fieldName] = value;

    // don't mark checkingForDuplicate unless we would end up with a valid entry
    const hasValidInput =
      this.type() === ContactTypes.INDIVIDUAL
        ? this.currentInputValues.last_name !== '' && this.currentInputValues.first_name !== ''
        : value !== '';

    if (hasValidInput) {
      this.checkingForDuplicate.set(true);
    }

    this.debounceTimer = setTimeout(() => {
      this.debouncedData.set({ ...this.currentInputValues });
      this.checkingForDuplicate.set(false);
    }, 400);
  }

  refresh() {
    this.debouncedData.set({ ...blankData });
    this.currentInputValues = { ...blankData };
    this.checkingForDuplicate.set(false);
    this.hideDuplicateWarning.set(false);
  }

  private checkForMatch(contact: Contact) {
    const type = this.type();
    const value = this.checkedValue().toLowerCase();
    if (contact.type !== type) return false;
    if (type === ContactTypes.INDIVIDUAL) return toFullName(contact).toLowerCase() === value;
    return contact[propertyMap[type]]?.toLowerCase() === value;
  }
}
