import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { REFUND_INDIVIDUAL_CONTRIBUTION } from './REFUND_INDIVIDUAL_CONTRIBUTION.model';

describe('REFUND_INDIVIDUAL_CONTRIBUTION', () => {
  let transactionType: REFUND_INDIVIDUAL_CONTRIBUTION;

  beforeEach(() => {
    transactionType = new REFUND_INDIVIDUAL_CONTRIBUTION();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB28A');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION);
  });
});
