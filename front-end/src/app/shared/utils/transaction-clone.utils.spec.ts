import { getTestIndividualReceipt, getTestTransactionByType } from './unit-test.utils';
import { isCloneable, resetCloneCoreFields, resetCloneMemoText } from './transaction-clone.utils';
import { ScheduleATransactionTypes } from '../models/transaction/schedule-a/schedule-a-transaction-types.model';

describe('transaction-clone.utils', () => {
  describe('resetCloneCoreFields', () => {
    it('should reset common clone fields', () => {
      const clone = getTestIndividualReceipt();
      clone.reports = [];
      clone.force_unaggregated = true;
      clone.children = [getTestIndividualReceipt()];

      resetCloneCoreFields(clone, undefined);

      expect(clone.id).toBeFalsy();
      expect(clone.reports).toBeFalsy();
      expect(clone.force_unaggregated).toBeUndefined();
      expect(clone.children).toEqual([]);
    });
  });

  describe('resetCloneMemoText', () => {
    it('should reset memo fields and memo_text_id by default', () => {
      const clone = getTestIndividualReceipt();
      clone.memo_text_id = 'memo-id';
      if (!clone.memo_text) throw new Error('Bad test setup');
      clone.memo_text.id = 'memo-id';
      clone.memo_text.transaction_id_number = 'transaction-id';
      clone.memo_text.transaction_uuid = 'uuid';

      const originalMemoText = clone.memo_text;
      resetCloneMemoText(clone, 'new-report-id');

      expect(clone.memo_text_id).toBeFalsy();
      expect(clone.memo_text).toBeTruthy();
      expect(clone.memo_text).not.toBe(originalMemoText);
      expect(clone.memo_text?.id).toBeFalsy();
      expect(clone.memo_text?.report_id).toBe('new-report-id');
      expect(clone.memo_text?.transaction_id_number).toBeFalsy();
      expect(clone.memo_text?.transaction_uuid).toBeFalsy();
    });

    it('should keep memo_text_id when memo text is absent and configured to do so', () => {
      const clone = getTestIndividualReceipt();
      clone.memo_text = undefined;
      clone.memo_text_id = 'preserve-me';

      resetCloneMemoText(clone, 'new-report-id', {
        resetMemoTextId: 'whenMemoTextPresent',
      });

      expect(clone.memo_text_id).toBe('preserve-me');
    });
  });

  describe('isCloneable', () => {
    it('should reject multi-entry transaction types', () => {
      const transaction = getTestTransactionByType(ScheduleATransactionTypes.EARMARK_RECEIPT);
      expect(isCloneable(transaction)).toBe(false);
    });
  });
});
