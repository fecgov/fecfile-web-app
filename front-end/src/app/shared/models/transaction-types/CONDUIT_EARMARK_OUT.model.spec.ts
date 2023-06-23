import { CONDUIT_EARMARK_OUT } from './CONDUIT_EARMARK_OUT.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupNM } from '../transaction-groups/transaction-group-nm.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { ContactTypes } from '../contact.model';

describe('CONDUIT_EARMARK_OUT', () => {
  let transactionType: CONDUIT_EARMARK_OUT;
  let transaction: SchBTransaction;

  beforeEach(() => {
    transactionType = new CONDUIT_EARMARK_OUT();
    transaction = getTestTransactionByType(ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT_DEPOSITED) as SchBTransaction;
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupNM);
  });

  it('#factory() should return a SchATransaction', () => {
    const transaction: SchBTransaction = transactionType.getNewTransaction();
    expect(transaction.form_type).toBe('SB23');
    expect(transaction.transaction_type_identifier).toBe(ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT);
  });

  it('#generatePurposeDescription() should reflect child', () => {
    const parentTransaction = getTestTransactionByType(
      ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_DEPOSITED
    ) as SchATransaction;
    parentTransaction.entity_type = ContactTypes.INDIVIDUAL;
    parentTransaction.contributor_first_name = 'Joe';
    parentTransaction.contributor_last_name = 'Schmoe';

    transaction.parent_transaction = parentTransaction;

    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Earmarked from Joe Schmoe (Individual)');
  });
});
