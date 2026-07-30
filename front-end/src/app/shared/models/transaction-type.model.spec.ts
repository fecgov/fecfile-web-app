/* eslint-disable @typescript-eslint/no-explicit-any */
import { ScheduleATransactionTypes } from './scha-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { ScheduleETransactionTypes } from './sche-transaction.model';
import {
  STANDARD_DOUBLE_ENTRY_CONTROLS,
  STANDARD_LIST_CONTROLS,
  STANDARD_SPLIT_CONTROLS,
} from './transaction-navigation-controls.model';

describe('Transaction Type Model', () => {
  it('#generatePurposeDescriptionWrapper() should not truncate short purpose descriptions', () => {
    const transaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT);
    const spy = vi.spyOn(transaction.transactionType, 'generatePurposeDescription');
    spy.mockReturnValue('A short response');

    const originalDescrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    const modifiedDescrip = transaction.transactionType?.generatePurposeDescriptionWrapper(transaction);
    expect(originalDescrip).toEqual(modifiedDescrip);
  });

  it('#generatePurposeDescriptionWrapper() should truncate long purpose descriptions', () => {
    const transaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT);
    const spy = vi.spyOn(transaction.transactionType, 'generatePurposeDescription');
    spy.mockReturnValue(
      'An absurdly long response' +
        'Just the biggest; no corners cut.' +
        'It needs to be at least 100 chars.' +
        'This should probably get it done.',
    );

    const originalDescrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    const modifiedDescrip = transaction.transactionType?.generatePurposeDescriptionWrapper(transaction);
    expect(originalDescrip).not.toEqual(modifiedDescrip);
    expect(modifiedDescrip?.length).toEqual(100);
  });

  it('form toggle functions to work', () => {
    let transaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT);
    expect(transaction.transactionType.hasSignature1()).toBe(false);
    expect(transaction.transactionType.hasSignature2()).toBe(false);
    expect(transaction.transactionType.hasSupportOpposeCode()).toBe(false);
    transaction = getTestTransactionByType(ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE);
    expect(transaction.transactionType.hasSignature1()).toBe(true);
    expect(transaction.transactionType.hasSupportOpposeCode()).toBe(true);
  });

  describe('#getNavigationControls()', () => {
    it('should return STANDARD_SPLIT_CONTROLS when transaction type is cloneable, not reatt/redes, and uses STANDARD_LIST_CONTROLS', () => {
      const transaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT);
      transaction.transactionType.isCloneableTransactionType = true;
      (transaction.transactionType as any)._navigationControls = STANDARD_LIST_CONTROLS;
      transaction.reatt_redes_id = undefined;

      const controls = transaction.transactionType.getNavigationControls(transaction);
      expect(controls).toBe(STANDARD_SPLIT_CONTROLS);
    });

    it('should return navigationControls when transaction has reatt_redes_id', () => {
      const transaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT);
      transaction.transactionType.isCloneableTransactionType = true;
      (transaction.transactionType as any).navigationControls = STANDARD_LIST_CONTROLS;
      transaction.reatt_redes_id = 'existing-reatt-redes-id';

      const controls = transaction.transactionType.getNavigationControls(transaction);
      expect(controls).toBe(STANDARD_LIST_CONTROLS);
    });

    it('should return navigationControls when isCloneableTransactionType is false', () => {
      const transaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT);
      transaction.transactionType.isCloneableTransactionType = false;
      (transaction.transactionType as any)._navigationControls = STANDARD_LIST_CONTROLS;
      transaction.reatt_redes_id = undefined;

      const controls = transaction.transactionType.getNavigationControls(transaction);
      expect(controls).toBe(STANDARD_LIST_CONTROLS);
    });

    it('should return custom navigationControls when navigationControls is not STANDARD_LIST_CONTROLS', () => {
      const transaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT);
      transaction.transactionType.isCloneableTransactionType = true;
      (transaction.transactionType as any)._navigationControls = STANDARD_DOUBLE_ENTRY_CONTROLS;
      transaction.reatt_redes_id = undefined;

      const controls = transaction.transactionType.getNavigationControls(transaction);
      expect(controls).toBe(STANDARD_DOUBLE_ENTRY_CONTROLS);
    });
  });
});
