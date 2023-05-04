import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupE } from '../transaction-groups/transaction-group-e';
import { PAC_RETURN } from './PAC_RETURN.model';

describe('PAC_RETURN', () => {
  let transactionType: PAC_RETURN;

  beforeEach(() => {
    transactionType = new PAC_RETURN(new TransactionGroupE());
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupE);
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11C');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_RETURN);
  });
  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as SchATransactionType).generatePurposeDescription).toBe(undefined);
  });
});
