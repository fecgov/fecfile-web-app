import { ScheduleATransactionTypeLabels } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypeLabels } from 'app/shared/models/schb-transaction.model';
import { ScheduleCTransactionTypeLabels } from 'app/shared/models/schc-transaction.model';
import { ScheduleC1TransactionTypeLabels } from 'app/shared/models/schc1-transaction.model';
import { ScheduleC2TransactionTypeLabels } from 'app/shared/models/schc2-transaction.model';
import { ScheduleDTransactionTypeLabels } from 'app/shared/models/schd-transaction.model';
import { ScheduleETransactionTypeLabels } from 'app/shared/models/sche-transaction.model';
import { ScheduleFTransactionTypeLabels } from 'app/shared/models/schf-transaction.model';
import type { LabelList } from 'app/shared/utils/label.utils';

export type TransactionCategory = 'receipts' | 'disbursements' | 'loans-and-debts';
export interface CategoryConfig {
  title: string;
  schedules: string;
  labels: LabelList;
  caption: string;
  hasMemoColumn: boolean;
  hasAggregateColumn: boolean;
  hasBalanceColumn: boolean;
  dateHeaderLabel?: string;
  dateCssClass?: string;
}

export const TRANSACTION_CATEGORY_CONFIG: Record<TransactionCategory, CategoryConfig> = {
  receipts: {
    title: 'Receipts',
    schedules: 'A',
    labels: ScheduleATransactionTypeLabels,
    caption:
      'Data table of all reports created by the committee broken down by Line, Type, Name, Date, Memo, Amount, Aggregate, Transaction ID, Associated with, and Actions.',
    hasMemoColumn: true,
    hasAggregateColumn: true,
    hasBalanceColumn: false,
  },
  disbursements: {
    title: 'Disbursements',
    schedules: 'B,E,F',
    labels: [...ScheduleBTransactionTypeLabels, ...ScheduleETransactionTypeLabels, ...ScheduleFTransactionTypeLabels],
    caption:
      'Data table of all reports created by the committee broken down by Line, Type, Name, Date, Memo, Amount, and Actions.',
    hasMemoColumn: true,
    hasAggregateColumn: false,
    hasBalanceColumn: false,
  },
  'loans-and-debts': {
    title: 'Loans and Debts',
    schedules: 'C,D',
    labels: [
      ...ScheduleCTransactionTypeLabels,
      ...ScheduleC1TransactionTypeLabels,
      ...ScheduleC2TransactionTypeLabels,
      ...ScheduleDTransactionTypeLabels,
    ],
    caption:
      'Data table of all reports created by the committee broken down by Line, Type, Name, Date incurred, Amount, Balance, Transaction ID, Associated with, and Actions.',
    hasMemoColumn: false,
    hasAggregateColumn: false,
    hasBalanceColumn: true,
    dateHeaderLabel: 'Incurred',
    dateCssClass: 'incurred-column',
  },
};
