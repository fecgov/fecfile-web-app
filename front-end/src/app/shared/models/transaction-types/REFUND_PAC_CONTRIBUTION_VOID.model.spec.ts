import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { REFUND_PAC_CONTRIBUTION_VOID } from './REFUND_PAC_CONTRIBUTION_VOID.model';

describe('REFUND_PAC_CONTRIBUTION_VOID', () => {
  let transactionType: REFUND_PAC_CONTRIBUTION_VOID;

  beforeEach(() => {
    transactionType = new REFUND_PAC_CONTRIBUTION_VOID();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB28C');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.REFUND_PAC_CONTRIBUTION_VOID);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription;
    expect(descrip).toBe(undefined);
  });
});
