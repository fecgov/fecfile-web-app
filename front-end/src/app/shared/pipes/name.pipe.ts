import { Pipe, PipeTransform } from '@angular/core';
import { Contact, isEntity } from '../models/contact.model';

@Pipe({ name: 'name' })
export class NamePipe implements PipeTransform {
  transform(contact: Contact | null | undefined): string {
    if (!contact) return '';
    if (isEntity(contact.type)) return contact.name ?? '';
    let name = `${contact.last_name}, ${contact.first_name}`;
    if (contact.middle_name) name += ' ' + contact.middle_name;
    if (contact.prefix) name += ', ' + contact.prefix;
    if (contact.suffix) name += ', ' + contact.suffix;

    return name;
  }
}
