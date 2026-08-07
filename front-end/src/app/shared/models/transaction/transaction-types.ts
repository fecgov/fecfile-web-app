import type { ScheduleATransactionTypes } from './schedule-a/schedule-a-transaction-types.model';
import type { ScheduleBTransactionTypes } from './schedule-b/schedule-b-transaction-types.model';
import type { ScheduleCTransactionTypes } from './schedule-c/schedule-c-transaction-types.model';
import type { ScheduleC1TransactionTypes } from './schedule-c1/schedule-c1-transaction-types.model';
import type { ScheduleC2TransactionTypes } from './schedule-c2/schedule-c2-transaction-types.model';
import type { ScheduleDTransactionTypes } from './schedule-d/schedule-d-transaction-types.model';
import type { ScheduleETransactionTypes } from './schedule-e/schedule-e-transaction-types.model';
import type { ScheduleFTransactionTypes } from './schedule-f/schedule-f-transaction-types.model';

export type TransactionTypes =
  | ScheduleATransactionTypes
  | ScheduleBTransactionTypes
  | ScheduleCTransactionTypes
  | ScheduleC1TransactionTypes
  | ScheduleC2TransactionTypes
  | ScheduleDTransactionTypes
  | ScheduleETransactionTypes
  | ScheduleFTransactionTypes;
