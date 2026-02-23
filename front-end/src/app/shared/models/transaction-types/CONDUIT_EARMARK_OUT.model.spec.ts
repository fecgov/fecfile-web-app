import { CONDUIT_EARMARK_OUT } from './CONDUIT_EARMARK_OUT.model';
import { SchATransaction } from '../scha-transaction.model';
import { SchBTransaction } from '../schb-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { ContactTypes } from '../contact.model';
import { ScheduleBTransactionTypes, ScheduleATransactionTypes } from '../type-enums';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';

describe('CONDUIT_EARMARK_OUT', () => {
  let transactionType: CONDUIT_EARMARK_OUT;
  let transaction: SchBTransaction;

  beforeEach(async () => {
    transactionType = new CONDUIT_EARMARK_OUT();
    transaction = (await getTestTransactionByType(ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT)) as SchBTransaction;
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB23');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT);
  });

  it('#generatePurposeDescription() should reflect child', async () => {
    const parentTransaction = (await getTestTransactionByType(
      ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT,
    )) as SchATransaction;
    parentTransaction.entity_type = ContactTypes.INDIVIDUAL;
    parentTransaction.contributor_first_name = 'Joe';
    parentTransaction.contributor_last_name = 'Schmoe';

    transaction.parent_transaction = parentTransaction;

    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Earmarked from Joe Schmoe');
  });

  it('#generatePurposeDescription() should not yield too long of a description', async () => {
    const parentTransaction = (await getTestTransactionByType(
      ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT,
    )) as SchATransaction;
    parentTransaction.entity_type = ContactTypes.INDIVIDUAL;
    parentTransaction.contributor_first_name = 'Joe';
    parentTransaction.contributor_last_name =
      'Alibaster Theodore Benjamin Worthington Daniel-Struthing Nilesback Adilade Dourson Schmoe IV';

    transaction.parent_transaction = parentTransaction;

    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe(
      'Earmarked from Joe Alibaster Theodore Benjamin Worthington Daniel-Struthing Nilesback Adilade Dou...',
    );
  });
});
