import { ReportTypes } from '../reports/report.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT } from './OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT.model';

describe('OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT', () => {
  let transactionType: OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT;

  beforeEach(() => {
    transactionType = new OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    const txn = transactionType.getNewTransaction();
    expect(transactionType.generatePurposeDescription(txn)).toBe(
      'Credit card memo entries do not meet itemization threshold.',
    );
    txn.children = [
      {
        itemized: true,
      } as SchBTransaction,
    ];
    expect(transactionType.generatePurposeDescription(txn)).toBe('Credit Card Memo: See Below');
  });

  it('hasElectionInformation() should be true on a form 3', () => {
    const hasElectionInformation = transactionType.hasElectionInformation(ReportTypes.F3);
    expect(hasElectionInformation).toBe(true);
  });

  it('hasElectionInformation() should be true on a form 3', () => {
    const hasElectionInformation = transactionType.hasElectionInformation(ReportTypes.F3X);
    expect(hasElectionInformation).toBe(false);
  });
});
