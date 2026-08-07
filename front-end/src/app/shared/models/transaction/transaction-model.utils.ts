import { instanceToPlain, plainToInstance, ClassConstructor } from 'class-transformer';
import { ContactTypes } from '../contacts/contact-types.model';
import { ScheduleIds } from './schedule-ids.model';
import type { ScheduleTransaction } from './schedule-transaction.model';
import type { TransactionListRecord } from './transaction-list-record.model';
import type { Transaction } from './transaction.model';

export function getTransactionName(transaction: ScheduleTransaction): string {
  if (transaction.entity_type === ContactTypes.INDIVIDUAL) {
    const firstName = transaction[
      transaction.transactionType.templateMap.first_name as keyof ScheduleTransaction
    ] as string;
    const lastName = transaction[
      transaction.transactionType.templateMap.last_name as keyof ScheduleTransaction
    ] as string;
    return `${firstName} ${lastName}`;
  }

  const orgName = transaction[
    transaction.transactionType.templateMap.organization_name as keyof ScheduleTransaction
  ] as string;
  return orgName;
}
export function hasNoContact(transaction?: Transaction): boolean {
  return !transaction?.contact_1;
}
export function isPulledForwardLoan(transaction?: Transaction | TransactionListRecord): boolean {
  return !!transaction?.loan_id && transaction.transactionType.scheduleId === ScheduleIds.C;
}
export function isDebtRepayment(transaction?: Transaction): boolean {
  return !!transaction?.debt_id && transaction.transactionType.scheduleId !== ScheduleIds.D;
}

export function cloneInstance<T extends Transaction>(instance: T | undefined): T | undefined {
  if (!instance) return undefined;
  const plain = instanceToPlain(instance);
  return plainToInstance(instance.constructor as ClassConstructor<T>, plain);
}
