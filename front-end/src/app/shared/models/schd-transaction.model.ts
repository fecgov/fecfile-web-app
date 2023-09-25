import { plainToClass } from 'class-transformer';
import { AggregationGroups, Transaction } from './transaction.model';
import { LabelList } from '../utils/label.utils';
import { getFromJSON, TransactionTypeUtils } from '../utils/transaction-type.utils';

export class SchDTransaction extends Transaction {
  entity_type: string | undefined;
  receipt_line_number: string | undefined;
  aggregation_group: AggregationGroups | undefined;

  creditor_organization_name: string | undefined;
  creditor_last_name: string | undefined;
  creditor_first_name: string | undefined;
  creditor_middle_name: string | undefined;
  creditor_prefix: string | undefined;
  creditor_suffix: string | undefined;
  creditor_street__1: string | undefined;
  creditor_street__2: string | undefined;
  creditor_city: string | undefined;
  creditor_state: string | undefined;
  creditor_zip: string | undefined;
  purpose_of_debt_or_obligation: string | undefined;
  beginning_balance: number | undefined;
  incurred_amount: number | undefined;
  payment_amount: number | undefined;
  balance_at_close: number | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any, depth = 2): SchDTransaction {
    const transaction = plainToClass(SchDTransaction, json);
    if (transaction.transaction_type_identifier) {
      const transactionType = TransactionTypeUtils.factory(transaction.transaction_type_identifier);
      transaction.setMetaProperties(transactionType);
    }
    if (depth > 0 && transaction.parent_transaction) {
      transaction.parent_transaction = getFromJSON(transaction.parent_transaction, depth - 1);
    }
    if (depth > 0 && transaction.children) {
      transaction.children = transaction.children.map(function (child) {
        return getFromJSON(child, depth - 1);
      });
    }
    return transaction;
  }

  override getFieldsNotToValidate(): string[] {
    return ['payment_amount', 'balance_at_close', ...super.getFieldsNotToValidate()];
  }
}

export enum ScheduleDTransactionGroups {
  DEBTS = 'DEBTS',
}

export type ScheduleDTransactionGroupsType = ScheduleDTransactionGroups.DEBTS;

export enum ScheduleDTransactionTypes {
  DEBT_OWED_BY_COMMITTEE = 'DEBT_OWED_BY_COMMITTEE',
  DEBT_OWED_TO_COMMITTEE = 'DEBT_OWED_TO_COMMITTEE',
}

export const ScheduleDTransactionTypeLabels: LabelList = [
  [ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE, 'Debt Owed By Committee'],
  [ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE, 'Debt Owed To Committee'],
];
