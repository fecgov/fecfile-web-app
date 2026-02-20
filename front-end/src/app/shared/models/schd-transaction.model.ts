import { Transform } from 'class-transformer';
import { Transaction } from './transaction.model';
import type { AggregationGroups } from './type-enums';

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
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  beginning_balance: number | undefined;
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  incurred_amount: number | undefined;
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  payment_amount: number | undefined;
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  balance_at_close: number | undefined;

  override getFieldsNotToValidate(): string[] {
    return ['payment_amount', 'balance_at_close', ...super.getFieldsNotToValidate()];
  }
}
