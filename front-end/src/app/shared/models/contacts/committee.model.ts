import { plainToInstance } from 'class-transformer';
import { ContactTypes, SimpleNameContact } from './contact.model';

export class Committee extends SimpleNameContact {
  type = ContactTypes.COMMITTEE;
  committee_id: string | undefined;

  static fromJSON(json: unknown): Committee {
    return plainToInstance(Committee, json);
  }
}
