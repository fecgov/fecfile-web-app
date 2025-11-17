export enum Categories {
  RECEIPT = 'receipt',
  DISBURSEMENT = 'disbursement',
  LOANS_AND_DEBTS = 'loans-and-debts',
}

export interface TypeValuePair {
  type: string;
  value: string;
}

export const Disbursement = {
  OPERATING_EXPENDITURES: { type: 'Disbursement', value: 'OPERATING EXPENDITURES' },
  CONTRIBUTIONS_EXPENDITURES_TO_REGISTERED_FILERS: {
    type: 'Disbursement',
    value: 'CONTRIBUTIONS/EXPENDITURES TO/ON BEHALF OF REGISTERED FILERS',
  },
  OTHER_EXPENDITURES: { type: 'Disbursement', value: 'OTHER EXPENDITURES' },
  REFUNDS: { type: 'Disbursement', value: 'REFUNDS' },
  FEDERAL_ELECTION_ACTIVITY_EXPENDITURES: { type: 'Disbursement', value: 'FEDERAL ELECTION ACTIVITY EXPENDITURES' },
  COORDINATED_EXPENDITURES: { type: 'Disbursement', value: 'COORDINATED_EXPENDITURES' },
} as const;
export type DisbursementType = (typeof Disbursement)[keyof typeof Disbursement];

export const LoansAndDebts = {
  LOANS: { type: 'LoansAndDebts', value: 'LOANS' },
  DEBTS: { type: 'LoansAndDebts', value: 'DEBTS' },
};
export type LoansAndDebtsType = (typeof LoansAndDebts)[keyof typeof LoansAndDebts];

export const Receipt = {
  CONTRIBUTIONS_FROM_INDIVIDUALS_PERSONS: { type: 'Receipt', value: 'CONTRIBUTIONS FROM INDIVIDUALS/PERSONS' },
  CONTRIBUTIONS_FROM_REGISTERED_FILERS: { type: 'Receipt', value: 'CONTRIBUTIONS FROM REGISTERED FILERS' },
  TRANSFERS: { type: 'Receipt', value: 'TRANSFERS' },
  REFUNDS: { type: 'Receipt', value: 'REFUNDS' },
  OTHER: { type: 'Receipt', value: 'OTHER' },
} as const;

export type ReceiptType = (typeof Receipt)[keyof typeof Receipt];

export const ScheduleC1TransactionGroups = {
  LOAN_AGREEMENTS: { type: 'ScheduleC1TransactionGroups', value: 'LOAN AGREEMENTS' },
};
export type ScheduleC1TransactionGroupsType =
  (typeof ScheduleC1TransactionGroups)[keyof typeof ScheduleC1TransactionGroups];
