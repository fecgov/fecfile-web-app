import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { ContactTypes } from '../contact.model';
import { TransactionTypeUtils } from '../../utils/transaction-type.utils';
import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';

describe('EARMARK_RECEIPT', () => {
  let transactionType: TransactionType | undefined;

  beforeEach(() => {
    transactionType = TransactionTypeUtils.factory('EARMARK_RECEIPT');
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
    if (!transactionType) {
      return;
    }
    const txn = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.EARMARK_RECEIPT);
  });

  it('#contributionPurposeDescripReadonly() should return an empty string', () => {
    if (!transactionType) {
      return;
    }
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe('');
  });
});
