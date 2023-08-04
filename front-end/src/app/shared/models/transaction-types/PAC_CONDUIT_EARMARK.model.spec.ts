import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { ContactTypes } from '../contact.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';

describe('PAC_PAC_CONDUIT_EARMARK', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_CONDUIT_EARMARK) as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA11C');
    expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_CONDUIT_EARMARK);
  });

  it('#generatePurposeDescription() should generate empty string', () => {
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('');
  });

  it('#generatePurposeDescription() should reflect child', () => {
    const childTransaction = getTestTransactionByType(
      ScheduleBTransactionTypes.PAC_CONDUIT_EARMARK_OUT
    ) as SchBTransaction;
    childTransaction.entity_type = ContactTypes.COMMITTEE;
    childTransaction.payee_organization_name = 'Joe';
    transaction.children = [childTransaction];

    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Earmarked for Joe (Committee)');
  });
});
