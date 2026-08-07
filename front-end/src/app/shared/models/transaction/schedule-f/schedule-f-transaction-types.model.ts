import type { LabelList } from 'app/shared/utils/label.utils';

export enum ScheduleFTransactionTypes {
  COORDINATED_PARTY_EXPENDITURE = 'COORDINATED_PARTY_EXPENDITURE',
  COORDINATED_PARTY_EXPENDITURE_VOID = 'COORDINATED_PARTY_EXPENDITURE_VOID',
}

export const ScheduleFTransactionTypeLabels: LabelList = [
  [ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE, 'Coordinated Party Expenditure'],
  [ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE_VOID, 'Void of Coordinated Party Expenditure'],
];
