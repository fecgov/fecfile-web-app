import { Pipe, PipeTransform } from '@angular/core';
import { StatesCodeMap } from '../utils/label.utils';
import { Contact } from '../models';

@Pipe({ name: 'address' })
export class AddressPipe implements PipeTransform {
  transform(contact: Contact | null | undefined): string {
    if (!contact) return '';

    let street = `${contact.street_1}`;
    if (contact.street_2) street += ` ${contact.street_2}`;

    let cityStateZip = `${contact.city}, ${StatesCodeMap.get(contact.state)}`;
    if (contact.zip) cityStateZip += ` ${contact.zip}`;

    return `<span class="addr-street">${street}</span> <span class="addr-city-state">${cityStateZip}</span>`;
  }
}
