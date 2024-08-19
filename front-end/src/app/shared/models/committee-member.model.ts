import { plainToInstance } from 'class-transformer';
import { LabelUtils } from '../utils/label.utils';
import { RoleLabels } from './role.model';

export class CommitteeMember {
  id = '';
  email = '';
  username = '';
  first_name = '';
  last_name = '';
  _role = '';
  roleLabel = '';
  is_active = false;

  // prettier-ignore
  static fromJSON(json: any): CommitteeMember { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToInstance(CommitteeMember, json);
  }

  set role(role) {
    this._role = role;
    this.roleLabel = LabelUtils.get(RoleLabels, role);
  }

  get role() {
    return this._role;
  }
}

export const CommitteeMemberRoles = {
  COMMITTEE_ADMINISTRATOR: 'Committee administrator',
};
