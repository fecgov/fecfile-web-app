import { plainToClass } from 'class-transformer';
import { BaseModel } from './base.model';
import { RoleLabels } from './role.model';
import { LabelUtils } from '../utils/label.utils';

/**
 * The UserLoginData type captures the fields returned from the server
 * after a successful login.
 */
export type UserLoginData = {
  committee_id: string | null;
  email: string | null;
  is_allowed: boolean;
  token: string | null;
};

export class CommitteeUser {
  email: string | null = null;
  username: string | null = null;
  first_name: string | null = null;
  last_name: string | null = null;
  role: string | null = null;
  is_active: boolean | null = null;

  // prettier-ignore
  static fromJSON(json: any): CommitteeUser { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(CommitteeUser, json);
  }

  public getRoleLabel(): string | null {
    if (this.role != null) return LabelUtils.get(RoleLabels, this.role);
    else return null;
  }
}

export class User extends BaseModel {
  id = 0;

  // prettier-ignore
  static fromJSON(json: any): User { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(User, json);
  }
}
