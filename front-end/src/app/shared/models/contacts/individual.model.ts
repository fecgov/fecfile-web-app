import { plainToInstance } from 'class-transformer';
import { Contact, ContactTypes, FullNameContact } from './contact.model';

export class Individual extends FullNameContact {
  override type = ContactTypes.INDIVIDUAL;

  static fromJSON(json: any): Individual {
    return plainToInstance(Individual, json);
  }
}
