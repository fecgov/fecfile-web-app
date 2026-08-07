import { ORGANIZATION } from 'app/shared/utils/transaction-type-properties';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL } from './FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';

describe('FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL', () => {
  let transactionType: FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL;

  beforeEach(() => {
    transactionType = new FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB30B');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL,
    );
  });

  it('#generatePurposeDescription() should be the correct value', () => {
    const txn = transactionType.getNewTransaction();
    expect(transactionType.generatePurposeDescription(txn)).toBe(
      'Payroll memo entries do not meet itemization threshold.',
    );
    txn.children = [
      {
        itemized: true,
      } as SchBTransaction,
    ];
    expect(transactionType.generatePurposeDescription(txn)).toBe('Payroll Memo: See Below');
  });

  it('#contextTypeOptions should be org', () => {
    expect(transactionType.contactTypeOptions).toEqual(ORGANIZATION);
  });
});
