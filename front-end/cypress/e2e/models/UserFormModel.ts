import { faker } from '@faker-js/faker';

export class UserFormData {
  email: string;
  role: string;
  constructor(formData: UserFormData) {
    this.email = formData.email;
    this.role = formData.role;
  }
}

export enum Roles {
  COMMITTEE_ADMINISTRATOR = 'Committee Administrator',
  MANAGER = 'Manager',
}

export const defaultFormData: UserFormData = createUser(Roles.COMMITTEE_ADMINISTRATOR);

export function createUser(role: Roles): UserFormData {
  return {
    email: faker.internet.email(),
    role,
  };
}
