import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { REFUND_INDIVIDUAL_CONTRIBUTION_VOID } from './REFUND_INDIVIDUAL_CONTRIBUTION_VOID.model';

describe('REFUND_INDIVIDUAL_CONTRIBUTION_VOID', () => {
  let transactionType: REFUND_INDIVIDUAL_CONTRIBUTION_VOID;

  beforeEach(() => {
    transactionType = new REFUND_INDIVIDUAL_CONTRIBUTION_VOID();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB28A');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION_VOID);
  });
});
