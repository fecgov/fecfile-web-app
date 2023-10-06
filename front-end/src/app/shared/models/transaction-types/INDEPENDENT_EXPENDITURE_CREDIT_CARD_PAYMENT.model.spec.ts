import { TransactionType } from 'app/shared/models/transaction-type.model';
import { SchETransaction, ScheduleETransactionTypes } from '../sche-transaction.model';
import { INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT } from './INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT.model';
import { Transaction } from '../transaction.model';

describe('INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT', () => {
  let transactionType: INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT;

  beforeEach(() => {
    transactionType = new INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('E');
  });

  it('#factory() should return a SchETransaction', () => {
    const txn: SchETransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SE');
    expect(txn.transaction_type_identifier).toBe(ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    const txn: SchETransaction = transactionType.getNewTransaction();

    expect((transactionType as TransactionType).generatePurposeDescription?.(txn)).toEqual('Credit Card: See Below');
  });
});
