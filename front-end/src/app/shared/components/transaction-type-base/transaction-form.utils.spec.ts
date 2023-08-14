import { FormControl, FormGroup } from '@angular/forms';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes } from 'app/shared/models/schb-transaction.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { AggregationGroups } from 'app/shared/models/transaction.model';
import { TransactionFormUtils } from './transaction-form.utils';

describe('FormUtils', () => {
  const t = new TransactionFormUtils();

  it('should be truthy', () => {
    expect(t).toBeTruthy();
  });

  it('should add the amount for not-refunds', () => {
    const form = new FormGroup({
      contribution_amount: new FormControl(),
      contribution_aggregate: new FormControl(),
      expenditure_amount: new FormControl(),
    });

    const transaction = SchATransaction.fromJSON({
      transaction_type_identifier: ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_CONVENTION_ACCOUNT,
      contribution_amount: 50,
    });

    const previous_transaction = SchATransaction.fromJSON({
      transaction_type_identifier: ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_CONVENTION_ACCOUNT,
      contribution_amount: 100,
      contribution_aggregate: 100,
    });

    TransactionFormUtils.updateAggregate(
      form,
      transaction.transactionType.templateMap,
      transaction,
      previous_transaction,
      transaction.contribution_amount as number
    );

    const aggregateFormControl = form.get('contribution_aggregate') as FormControl;
    expect(aggregateFormControl.value).toEqual(150);
  });

  it('should add the amount for refunds', () => {
    const form = new FormGroup({
      contribution_amount: new FormControl(),
      aggregate_amount: new FormControl(),
      expenditure_amount: new FormControl(),
    });

    const transaction = SchBTransaction.fromJSON({
      transaction_type_identifier: ScheduleBTransactionTypes.TRIBAL_REFUND_NP_CONVENTION_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_CONVENTION_ACCOUNT,
      expenditure_amount: 50,
    });

    const previous_transaction = SchATransaction.fromJSON({
      transaction_type_identifier: ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_CONVENTION_ACCOUNT,
      contribution_amount: 100,
      contribution_aggregate: 100,
    });

    TransactionFormUtils.updateAggregate(
      form,
      transaction.transactionType.templateMap,
      transaction,
      previous_transaction,
      transaction.expenditure_amount as number
    );

    const aggregateFormControl = form.get('aggregate_amount') as FormControl;
    expect(aggregateFormControl.value).toEqual(50);
  });
});
