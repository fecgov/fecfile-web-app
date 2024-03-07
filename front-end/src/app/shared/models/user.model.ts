import { plainToClass } from 'class-transformer';
import { BaseModel } from './base.model';

/**
 * The UserLoginData type captures the fields returned from the server
 * after a successful login.
 */
export type UserLoginData = {
  first_name?: string;
  last_name?: string;
  email?: string;
  security_consent_date?: string;
};

export class User extends BaseModel {
  id = 0;

  // prettier-ignore
  static fromJSON(json: any): User { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(User, json);
  }
}
