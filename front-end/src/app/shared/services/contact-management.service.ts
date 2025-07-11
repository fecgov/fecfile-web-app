import { computed, effect, Injectable, signal } from '@angular/core';
import { LabelUtils, PrimeOptions } from '../utils/label.utils';
import { Contact, ContactTypeLabels, ContactTypes, emptyContact } from '../models';

@Injectable()
export class ContactManager {
  readonly contactType = signal<ContactTypes>(ContactTypes.INDIVIDUAL);
  readonly contactTypeOptions = signal<PrimeOptions>(LabelUtils.getPrimeOptions(ContactTypeLabels));
  readonly contact = signal<Contact>(new Contact());
  readonly outerContact = signal<Contact | null>(null);
  readonly clearOnLoad = signal(true);

  setAsSingle(contactType: ContactTypes) {
    this.setContactTypeOptions([contactType]);
  }

  setContactTypeOptions(contactTypes: ContactTypes[]) {
    this.contactTypeOptions.set(LabelUtils.getPrimeOptions(ContactTypeLabels, contactTypes));
    this.contactType.set(contactTypes[0]);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ContactManagementService {
  private readonly map = new Map<string, ContactManager>();
  readonly showDialog = signal(false);
  readonly activeKey = signal<string>(''); // Key being used by the ContactModal
  readonly activeManager = computed(() => this.get(this.activeKey())); // Returns the ContactManager associated with the key

  constructor() {
    // When Request to show dialog is called,
    // and the active ContactManager should show an empty contact ready to be edited,
    // set the contact to a new Empty Contact of the appropriate contact type.
    effect(() => {
      if (this.showDialog() && this.activeManager().clearOnLoad()) {
        this.activeManager().contact.set(emptyContact(this.activeManager().contactType()));
      }
    });
  }

  // Return the ContactManager associated with the key or lazily initialize one if it's the first request
  get(key: string) {
    return this.map.get(key) ?? this.map.set(key, new ContactManager()).get(key)!;
  }
}
