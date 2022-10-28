import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { ContactTypes } from '../contact.model';
import { TransactionTypeUtils } from '../../utils/transaction-type.utils';
import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';
import { EARMARK_MEMO } from './EARMARK_MEMO.model';

describe('EARMARK_RECEIPT', () => {
  let transactionType: TransactionType;

  beforeEach(() => {
    transactionType = TransactionTypeUtils.factory('EARMARK_RECEIPT') as TransactionType;
    if (transactionType) {
      transactionType.transaction = SchATransaction.fromJSON({
        id: 999,
        entitiy_type: ContactTypes.INDIVIDUAL,
      });
    }
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    if (transactionType) {
      expect(transactionType.scheduleId).toBe('A');
      expect(transactionType.componentGroupId).toBe('AG');
    }
  });

  it('#factory() should return a SchATransaction', () => {
    const txn = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.EARMARK_RECEIPT);
  });

  it('#contributionPurposeDescripReadonly() should return an empty string', () => {
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe('');
  });

  it('#contributionPurposeDescripReadonly() should reflect child', () => {
    const childTransactionType: TransactionType = TransactionTypeUtils.factory(
      ScheduleATransactionTypes.EARMARK_MEMO
    ) as TransactionType;
    childTransactionType.transaction = childTransactionType.getNewTransaction();
    transactionType.childTransactionType = childTransactionType;
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe('');
  });
});
