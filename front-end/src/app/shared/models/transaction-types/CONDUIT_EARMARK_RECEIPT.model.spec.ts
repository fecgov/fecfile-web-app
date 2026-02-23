import { SchATransaction } from '../scha-transaction.model';
import { ContactTypes } from '../contact.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { SchBTransaction } from '../schb-transaction.model';
import { ScheduleATransactionTypes, ScheduleBTransactionTypes } from '../type-enums';

describe('CONDUIT_EARMARK_RECEIPT', () => {
  let transaction: SchATransaction;

  beforeEach(async () => {
    transaction = (await getTestTransactionByType(
      ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT,
    )) as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA11AI');
    expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_DEPOSITED);
  });

  it('#generatePurposeDescription() should generate empty string', () => {
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('');
  });

  it('#generatePurposeDescription() should reflect child', async () => {
    const childTransaction = (await getTestTransactionByType(
      ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT,
    )) as SchBTransaction;
    childTransaction.entity_type = ContactTypes.COMMITTEE;
    childTransaction.payee_organization_name = 'Joe';
    transaction.children = [childTransaction];

    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Earmarked for Joe');
  });

  it('#generatePurposeDescription() should not yield too long of a description', async () => {
    const childTransaction = (await getTestTransactionByType(
      ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT,
    )) as SchBTransaction;
    childTransaction.entity_type = ContactTypes.COMMITTEE;
    childTransaction.payee_organization_name =
      'Joe Alibaster Theodore Benjamin Worthington Daniel-Struthing Nilesback Adilade Dourson Schmoe IV';
    transaction.children = [childTransaction];

    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe(
      'Earmarked for Joe Alibaster Theodore Benjamin Worthington Daniel-Struthing Nilesback Adilade Dour...',
    );
  });
});
