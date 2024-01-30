import { LabelList } from '../utils/label.utils';

export enum Roles {
  COMMITTEE_ADMINISTRATOR = 'COMMITTEE_ADMINISTRATOR',
  REVIEWER = 'REVIEWER',
}

export type RoleType = Roles.COMMITTEE_ADMINISTRATOR | Roles.REVIEWER;

export const RoleLabels: LabelList = [
  [Roles.COMMITTEE_ADMINISTRATOR, 'Committee Administrator'],
  [Roles.REVIEWER, 'Reviewer'],
];
