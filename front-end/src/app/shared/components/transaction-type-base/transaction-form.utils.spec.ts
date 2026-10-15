import { FormGroup } from '@angular/forms';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes } from 'app/shared/models/schb-transaction.model';
import { AggregationGroups } from 'app/shared/models/transaction.model';
import { Contact, ContactTypes } from 'app/shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { TransactionFormUtils } from './transaction-form.utils';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';
import { SchETransaction, ScheduleETransactionTypes } from 'app/shared/models/sche-transaction.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { ScheduleFTransactionTypes, SchFTransaction } from 'app/shared/models/schf-transaction.model';
import { Subject, of } from 'rxjs';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';

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

    TransactionFormUtils.updateAggregate(
      form,
      'aggregate',
      transaction.transactionType.templateMap,
      transaction,
      100,
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

    TransactionFormUtils.updateAggregate(
      form,
      'aggregate',
      transaction.transactionType.templateMap,
      transaction,
      100,
      transaction.expenditure_amount as number,
    );

    const aggregateFormControl = form.get('aggregate_amount') as SubscriptionFormControl;
    expect(aggregateFormControl.value).toEqual(50);
  });

  it('should initialize Schedule B aggregate_amount as a number', () => {
    const form = new FormGroup({
      entity_type: new SubscriptionFormControl(),
      aggregate_amount: new SubscriptionFormControl(),
      memo_code: new SubscriptionFormControl(),
      expenditure_purpose_descrip: new SubscriptionFormControl(),
    });

    const transaction = SchBTransaction.fromJSON({
      transaction_type_identifier: ScheduleBTransactionTypes.OTHER_DISBURSEMENT,
      report_ids: ['1'],
    });

    TransactionFormUtils.resetForm(
      form,
      transaction,
      [{ label: 'Organization', value: ContactTypes.ORGANIZATION }],
      undefined,
    );

    const aggregateFormControl = form.get('aggregate_amount') as SubscriptionFormControl;
    expect(aggregateFormControl.value).toEqual(0);
  });

  it('hydrates primary candidate contact fields when editing a transaction', async () => {
    const transaction = getTestTransactionByType(
      ScheduleATransactionTypes.CONTRIBUTION_FROM_CANDIDATE,
    ) as SchATransaction;
    transaction.id = 'transaction-id';
    transaction.entity_type = ContactTypes.CANDIDATE;
    transaction.contact_1 = Contact.fromJSON({
      type: ContactTypes.CANDIDATE,
      candidate_id: 'C12345678',
      last_name: 'Candidate',
      first_name: 'Pat',
      middle_name: 'Q',
      prefix: 'Dr',
      suffix: 'Jr',
      candidate_office: 'S',
      candidate_state: 'NY',
      candidate_district: '12',
    });
    const form = new FormGroup(
      Object.fromEntries(
        transaction.transactionType.getFormControlNames().map((field) => [field, new SubscriptionFormControl()]),
      ),
    );
    const component = {
      destroy$: new Subject<void>(),
    } as TransactionTypeBaseComponent;
    const contactService = {
      getFecIdValidator: () => () => of(null),
    } as unknown as ContactService;

    await TransactionFormUtils.onInit(component, form, transaction, {}, contactService);

    expect(form.get('donor_candidate_fec_id')?.value).toBe('C12345678');
    expect(form.get('donor_candidate_last_name')?.value).toBe('Candidate');
    expect(form.get('donor_candidate_first_name')?.value).toBe('Pat');
    expect(form.get('donor_candidate_middle_name')?.value).toBe('Q');
    expect(form.get('donor_candidate_prefix')?.value).toBe('Dr');
    expect(form.get('donor_candidate_suffix')?.value).toBe('Jr');
    expect(form.get('donor_candidate_office')?.value).toBe('S');
    expect(form.get('donor_candidate_state')?.value).toBe('NY');
    expect(form.get('donor_candidate_district')?.value).toBe('12');
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

  TransactionFormUtils.updateAggregate(
    form,
    'calendar_ytd',
    transaction.transactionType.templateMap,
    transaction,
    100,
    transaction.expenditure_amount as number,
  );

  const calendarYTDFormControl = form.get('calendar_ytd_per_election_office') as SubscriptionFormControl;
  expect(calendarYTDFormControl.value).toEqual(150);
});

it('should add the amount for payee candidate YTD', () => {
  const form = new FormGroup(
    {
      expenditure_amount: new SubscriptionFormControl(),
      aggregate_general_elec_expended: new SubscriptionFormControl(),
    },
    { updateOn: 'blur' },
  );

  const transaction = SchFTransaction.fromJSON({
    transaction_type_identifier: ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
    aggregation_group: AggregationGroups.COORDINATED_PARTY_EXPENDITURES,
    expenditure_amount: 50,
  });

  TransactionFormUtils.updateAggregate(
    form,
    'aggregate_general_elec_expended',
    transaction.transactionType.templateMap,
    transaction,
    100,
    transaction.expenditure_amount as number,
  );

  const aggregateFormControl = form.get('aggregate_general_elec_expended') as SubscriptionFormControl;
  expect(aggregateFormControl.value).toEqual(150);
});
