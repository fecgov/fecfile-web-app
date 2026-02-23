import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { TRANSFER_TO_AFFILIATES } from './TRANSFER_TO_AFFILIATES.model';

describe('TRANSFER_TO_AFFILIATES', () => {
  let transactionType: TRANSFER_TO_AFFILIATES;

  beforeEach(() => {
    transactionType = new TRANSFER_TO_AFFILIATES();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB22');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.TRANSFER_TO_AFFILIATES);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription;
    expect(descrip).toBe(undefined);
  });
});
