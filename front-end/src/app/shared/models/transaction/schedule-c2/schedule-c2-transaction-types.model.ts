import type { LabelList } from 'app/shared/utils/label.utils';

export enum ScheduleC2TransactionTypes {
  C2_LOAN_GUARANTOR = 'C2_LOAN_GUARANTOR',
}

export const ScheduleC2TransactionTypeLabels: LabelList = [
  [ScheduleC2TransactionTypes.C2_LOAN_GUARANTOR, 'Guarantors to loan source'],
];
