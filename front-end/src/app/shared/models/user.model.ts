import { plainToClass } from 'class-transformer';
import { BaseModel } from './base.model';

export type UserLoginData = {
  committee_id: string | null;
  email: string | null;
  is_allowed: boolean;
  token: string | null;
};

export class User extends BaseModel {
  id: number = 0;

  static getInstance(json: any): User {
    return plainToClass(User, json);
  }
}
