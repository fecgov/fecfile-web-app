import { plainToInstance } from 'class-transformer';
import { Contact, ContactTypes, SimpleNameContact } from './contact.model';

export class Organization extends SimpleNameContact {
  type = ContactTypes.COMMITTEE;

  static fromJSON(json: any): Organization {
    return plainToInstance(Organization, json);
  }
}
