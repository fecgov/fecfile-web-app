import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { CONTRIBUTION_TO_OTHER_COMMITTEE } from './CONTRIBUTION_TO_OTHER_COMMITTEE.model';

describe('CONTRIBUTION_TO_OTHER_COMMITTEE', () => {
  let transactionType: CONTRIBUTION_TO_OTHER_COMMITTEE;

  beforeEach(() => {
    transactionType = new CONTRIBUTION_TO_OTHER_COMMITTEE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB23');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription;
    expect(descrip).toBe(undefined);
  });
});
