import type { LabelList } from 'app/shared/utils/label.utils';

export enum ScheduleCTransactionTypes {
  LOAN_RECEIVED_FROM_INDIVIDUAL = 'LOAN_RECEIVED_FROM_INDIVIDUAL',
  LOAN_RECEIVED_FROM_BANK = 'LOAN_RECEIVED_FROM_BANK',
  LOAN_BY_COMMITTEE = 'LOAN_BY_COMMITTEE',
}

export const ScheduleCTransactionTypeLabels: LabelList = [
  [ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL, 'Loan Received from Individual'],
  [ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK, 'Loan Received from Bank'],
  [ScheduleCTransactionTypes.LOAN_BY_COMMITTEE, 'Loan By Committee'],
];
