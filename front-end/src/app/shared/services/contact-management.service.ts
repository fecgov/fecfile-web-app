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
  readonly activeKey = signal<string>('');
  readonly active = computed(() => this.get(this.activeKey()));

  constructor() {
    effect(() => {
      if (this.showDialog() && this.active().clearOnLoad()) {
        this.active().contact.set(emptyContact(this.active().contactType()));
      }
    });
  }

  get(key: string) {
    let manager = this.map.get(key);
    if (!manager) {
      manager = new ContactManager();
      this.map.set(key, manager);
    }
    return manager;
  }
}
