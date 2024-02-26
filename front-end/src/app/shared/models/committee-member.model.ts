import { RoleLabels } from './role.model';
import { LabelUtils } from '../utils/label.utils';
import { plainToInstance } from 'class-transformer';

export class CommitteeMember {
  id = '';
  email = '';
  username = '';
  first_name = '';
  last_name = '';
  role = '';
  is_active = false;

  // prettier-ignore
  static fromJSON(json: any): CommitteeMember { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToInstance(CommitteeMember, json);
  }

  public getRoleLabel(): string | undefined {
    return LabelUtils.get(RoleLabels, this.role);
  }
}

export const CommitteeMemberRoles = {
  COMMITTEE_ADMINISTRATOR: 'Committee administrator',
};
