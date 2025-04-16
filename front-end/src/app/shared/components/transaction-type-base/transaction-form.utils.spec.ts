import { FormGroup } from '@angular/forms';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes } from 'app/shared/models/schb-transaction.model';
import { AggregationGroups } from 'app/shared/models/transaction.model';
import { TransactionFormUtils } from './transaction-form.utils';
import { SchETransaction, ScheduleETransactionTypes } from 'app/shared/models/sche-transaction.model';
import { SubscriptionFormControl } from 'app/shared/utils/signal-form-control';

describe('FormUtils', () => {
  const t = new TransactionFormUtils();

  it('should be truthy', () => {
    expect(t).toBeTruthy();
  });

  it('should add the amount for not-refunds', () => {
    const form = new FormGroup({
      contribution_amount: new SubscriptionFormControl(),
      contribution_aggregate: new SubscriptionFormControl(),
      expenditure_amount: new SubscriptionFormControl(),
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
      'aggregate',
      transaction.transactionType.templateMap,
      transaction,
      previous_transaction,
      transaction.contribution_amount as number,
    );

    const aggregateFormControl = form.get('contribution_aggregate') as SubscriptionFormControl;
    expect(aggregateFormControl.value).toEqual(150);
  });

  it('should add the amount for refunds', () => {
    const form = new FormGroup(
      {
        contribution_amount: new SubscriptionFormControl(),
        aggregate_amount: new SubscriptionFormControl(),
        expenditure_amount: new SubscriptionFormControl(),
      },
      { updateOn: 'blur' },
    );

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
      'aggregate',
      transaction.transactionType.templateMap,
      transaction,
      previous_transaction,
      transaction.expenditure_amount as number,
    );

    const aggregateFormControl = form.get('aggregate_amount') as SubscriptionFormControl;
    expect(aggregateFormControl.value).toEqual(50);
  });
});

it('should add the amount for calendar YTD', () => {
  const form = new FormGroup(
    {
      expenditure_amount: new SubscriptionFormControl(),
      calendar_ytd_per_election_office: new SubscriptionFormControl(),
    },
    { updateOn: 'blur' },
  );

  const transaction = SchETransaction.fromJSON({
    transaction_type_identifier: ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE,
    aggregation_group: AggregationGroups.INDEPENDENT_EXPENDITURE,
    expenditure_amount: 50,
  });

  const previous_transaction = SchETransaction.fromJSON({
    transaction_type_identifier: ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE,
    aggregation_group: AggregationGroups.INDEPENDENT_EXPENDITURE,
    expenditure_amount: 100,
    calendar_ytd_per_election_office: 100,
  });

  TransactionFormUtils.updateAggregate(
    form,
    'calendar_ytd',
    transaction.transactionType.templateMap,
    transaction,
    previous_transaction,
    transaction.expenditure_amount as number,
  );

  const calendarYTDFormControl = form.get('calendar_ytd_per_election_office') as SubscriptionFormControl;
  expect(calendarYTDFormControl.value).toEqual(150);
});
