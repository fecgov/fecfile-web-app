import { plainToInstance } from 'class-transformer';
import { Roles } from './role.model';

export class CommitteeMember {
  id = '';
  email = '';
  username = '';
  first_name = '';
  last_name = '';
  role = '';
  is_active = false;

  get isAdmin(): boolean {
    return Roles[this.role as keyof typeof Roles] === Roles.COMMITTEE_ADMINISTRATOR;
  }

  // prettier-ignore
  static fromJSON(json: any): CommitteeMember { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToInstance(CommitteeMember, json);
  }
}
