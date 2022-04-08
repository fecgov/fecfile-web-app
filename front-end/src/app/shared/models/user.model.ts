import { plainToClass } from 'class-transformer';
import { BaseModel } from './base.model';
import { RoleType } from './role.model';

export type UserLoginData = {
  committee_id: string | null;
  email: string | null;
  role: RoleType | null;
  token: string | null;
};

export class User extends BaseModel {
  id = 0;

  static getInstance(json: any): User {
    return plainToClass(User, json);
  }
}
