import { plainToClass } from 'class-transformer';
import { LabelUtils } from '../utils/label.utils';
import { BaseModel } from './base.model';
import { RoleLabels } from './role.model';

/**
 * The UserLoginData type captures the fields returned from the server
 * after a successful login.
 */
export type UserLoginData = {
  first_name: string;
  last_name: string;
  email: string;
  security_consent_date: string | undefined;
  login_dot_gov?: boolean;
};

export class CommitteeUser {
  email = '';
  username = '';
  first_name = '';
  last_name = '';
  role = '';
  is_active = false;

  // prettier-ignore
  static fromJSON(json: any): CommitteeUser { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(CommitteeUser, json);
  }

  public getRoleLabel(): string | undefined {
    return LabelUtils.get(RoleLabels, this.role);
  }
}

export class User extends BaseModel {
  id = 0;

  // prettier-ignore
  static fromJSON(json: any): User { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(User, json);
  }
}
