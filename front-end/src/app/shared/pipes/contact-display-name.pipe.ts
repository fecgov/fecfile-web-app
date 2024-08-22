import { Pipe, PipeTransform } from '@angular/core';
import { Contact, ContactTypes } from '../models/contact.model';

@Pipe({
  name: 'contactDisplayName',
})
export class ContactDisplayNamePipe implements PipeTransform {
  transform(contact: Contact): string {
    if ([ContactTypes.INDIVIDUAL, ContactTypes.CANDIDATE].includes(contact.type)) {
      return `${contact.last_name}, ${contact.first_name}`;
    } else {
      return contact.name || '';
    }
  }
}
