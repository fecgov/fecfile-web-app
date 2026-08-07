import type { LabelList } from 'app/shared/utils/label.utils';

export enum ScheduleDTransactionTypes {
  DEBT_OWED_BY_COMMITTEE = 'DEBT_OWED_BY_COMMITTEE',
  DEBT_OWED_TO_COMMITTEE = 'DEBT_OWED_TO_COMMITTEE',
}

export const ScheduleDTransactionTypeLabels: LabelList = [
  [ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE, 'Debt Owed By Committee'],
  [ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE, 'Debt Owed To Committee'],
];
