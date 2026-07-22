import { Pipe, PipeTransform } from '@angular/core';
import { StatesCodeMap } from '../utils/label.utils';
import { Contact } from '../models';

@Pipe({ name: 'address' })
export class AddressPipe implements PipeTransform {
  transform(contact: Contact | null | undefined): string {
    if (!contact) return '';
    let address = `${contact.street_1}<wbr>`;
    if (contact.street_2) address += ` ${contact.street_2}<wbr>`;
    address += ` ${contact.city}, ${StatesCodeMap.get(contact.state)}`;
    if (contact.zip) address += ` ${contact.zip}<wbr>`;
    address += ` ${contact.country}`;
    return address;
  }
}
