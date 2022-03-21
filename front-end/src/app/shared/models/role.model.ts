import { LabelList } from '../utils/label.utils';

export enum Roles {
  COMMITTEE_ADMIN = 'C_ADMIN',
  BACKUP_COMMITTEE_ADMIN = 'BC_ADMIN',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  REVIEWER = 'REVIEWER',
}

export type RoleType =
  | Roles.COMMITTEE_ADMIN
  | Roles.BACKUP_COMMITTEE_ADMIN
  | Roles.ADMIN
  | Roles.EDITOR
  | Roles.REVIEWER;

export const RoleLabels: LabelList = [
  [Roles.COMMITTEE_ADMIN, 'Committee Administrator'],
  [Roles.BACKUP_COMMITTEE_ADMIN, 'Backup Committee Administrator'],
  [Roles.ADMIN, 'Administrator'],
  [Roles.EDITOR, 'Editor'],
  [Roles.REVIEWER, 'Reviewer'],
];
