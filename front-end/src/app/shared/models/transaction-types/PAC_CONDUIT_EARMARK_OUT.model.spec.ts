import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { ContactTypes } from '../contact.model';
import { PAC_CONDUIT_EARMARK_OUT } from './PAC_CONDUIT_EARMARK_OUT.model';

describe('PAC_CONDUIT_EARMARK_OUT', () => {
  let transactionType: PAC_CONDUIT_EARMARK_OUT;
  let transaction: SchBTransaction;

  beforeEach(() => {
    transactionType = new PAC_CONDUIT_EARMARK_OUT();
    transaction = getTestTransactionByType(
      ScheduleBTransactionTypes.PAC_CONDUIT_EARMARK_OUT_DEPOSITED,
    ) as SchBTransaction;
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', () => {
    const transaction: SchBTransaction = transactionType.getNewTransaction();
    expect(transaction.form_type).toBe('SB23');
    expect(transaction.transaction_type_identifier).toBe(ScheduleBTransactionTypes.PAC_CONDUIT_EARMARK_OUT);
  });

  it('#generatePurposeDescription() should reflect child', () => {
    const parentTransaction = getTestTransactionByType(
      ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_RECEIPT_DEPOSITED,
    ) as SchATransaction;
    parentTransaction.entity_type = ContactTypes.INDIVIDUAL;
    parentTransaction.contributor_organization_name = 'Joe';

    transaction.parent_transaction = parentTransaction;

    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Earmarked from Joe');
  });
  it('#generatePurposeDescription() should not yield too long of a description', () => {
    const parentTransaction = getTestTransactionByType(
      ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_RECEIPT_DEPOSITED,
    ) as SchATransaction;
    parentTransaction.entity_type = ContactTypes.INDIVIDUAL;
    parentTransaction.contributor_organization_name =
      'Alibaster Theodore Benjamin Worthington Daniel-Struthing Nilesback Adilade Dourson Schmoe IV';

    transaction.parent_transaction = parentTransaction;

    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe(
      'Earmarked from Alibaster Theodore Benjamin Worthington Daniel-Struthing Nilesback Adilade Dourson...',
    );
  });
});
