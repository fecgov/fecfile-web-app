import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleATransactionTypes } from '../type-enums';
import { JOINT_FUNDRAISING_TRANSFER } from './JOINT_FUNDRAISING_TRANSFER.model';

describe('JOINT_FUNDRAISING_TRANSFER', () => {
  let transactionType: JOINT_FUNDRAISING_TRANSFER;

  beforeEach(() => {
    transactionType = new JOINT_FUNDRAISING_TRANSFER();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA12');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Transfer of Joint Fundraising Proceeds');
  });
});
