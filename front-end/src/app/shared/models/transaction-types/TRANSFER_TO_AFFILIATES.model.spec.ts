import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupE } from '../transaction-groups/transaction-group-e.model';
import { TRANSFER_TO_AFFILIATES } from './TRANSFER_TO_AFFILIATES.model';

describe('TRANSFER_TO_AFFILIATES', () => {
  let transactionType: TRANSFER_TO_AFFILIATES;

  beforeEach(() => {
    transactionType = new TRANSFER_TO_AFFILIATES();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupE);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB22');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.TRANSFER_TO_AFFILIATES);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription;
    expect(descrip).toBe(undefined);
  });
});
