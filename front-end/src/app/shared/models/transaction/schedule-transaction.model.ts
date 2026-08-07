import type { SchATransaction } from './schedule-a/scha-transaction.model';
import type { SchBTransaction } from './schedule-b/schb-transaction.model';
import type { SchCTransaction } from './schedule-c/schc-transaction.model';
import type { SchC1Transaction } from './schedule-c1/schc1-transaction.model';
import type { SchC2Transaction } from './schedule-c2/schc2-transaction.model';
import type { SchDTransaction } from './schedule-d/schd-transaction.model';
import type { SchETransaction } from './schedule-e/sche-transaction.model';
import type { SchFTransaction } from './schedule-f/schf-transaction.model';

export type ScheduleTransaction =
  | SchATransaction
  | SchBTransaction
  | SchCTransaction
  | SchC1Transaction
  | SchC2Transaction
  | SchDTransaction
  | SchETransaction
  | SchFTransaction;
