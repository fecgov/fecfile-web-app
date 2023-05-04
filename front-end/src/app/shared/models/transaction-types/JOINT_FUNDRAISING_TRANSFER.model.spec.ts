import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupE } from '../transaction-groups/transaction-group-e';
import { JOINT_FUNDRAISING_TRANSFER } from './JOINT_FUNDRAISING_TRANSFER.model';

describe('JOINT_FUNDRAISING_TRANSFER', () => {
  let transactionType: JOINT_FUNDRAISING_TRANSFER;

  beforeEach(() => {
    transactionType = new JOINT_FUNDRAISING_TRANSFER();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupE);
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA12');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Transfer of Joint Fundraising Proceeds');
  });
});
