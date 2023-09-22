import { SchCTransaction, ScheduleCTransactionTypes } from '../schc-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';

describe('LOAN_RECEIVED_FROM_INDIVIDUAL', () => {
  let transaction: SchCTransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL) as SchCTransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('C');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SC/10');
    expect(transaction.transaction_type_identifier).toBe(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL);
  });

  it('should change navigation control if pulled forward', () => {
    let navControls = transaction.transactionType.navigationControls;
    if (navControls?.continueControls) expect(navControls.continueControls[0].label).toBe('Save both transactions');
    navControls = transaction.transactionType.getNavigationControls(transaction);
    if (navControls?.continueControls) expect(navControls.continueControls[0].label).toBe('Save both transactions');
    transaction.loan_id = 'test';
    navControls = transaction.transactionType.getNavigationControls(transaction);
    if (navControls?.continueControls) expect(navControls.continueControls[0].label).toBe('Save');
  });

  it('should change footer if pulled forward', () => {
    const footerText =
      'The information in this loan will automatically create a related receipt. Review the receipt; enter a purpose of receipt or note/memo text; or continue without reviewing and “Save transactions.”';
    let footer = transaction.transactionType.footer;
    expect(footer).toBe(footerText);
    footer = transaction.transactionType.getFooter(transaction);
    expect(footer).toBe(footerText);
    transaction.loan_id = 'test';
    footer = transaction.transactionType.getFooter(transaction);
    expect(footer).toBeUndefined();
  });
});
