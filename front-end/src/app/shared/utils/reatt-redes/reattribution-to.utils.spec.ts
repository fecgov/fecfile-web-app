import { ReattributionToUtils } from './reattribution-to.utils';
import { getTestTransactionByType, testScheduleATransaction } from 'app/shared/utils/unit-test.utils';
import { SchATransaction, ScheduleATransactionTypes } from '../../models/scha-transaction.model';

describe('Reattribution To', () => {
  describe('overlayTransactionProperties', () => {
    it('should override default properties', () => {
      const origTransaction = { ...testScheduleATransaction } as SchATransaction;
      const toTransaction = ReattributionToUtils.overlayTransactionProperties(
        getTestTransactionByType(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT) as SchATransaction,
        origTransaction,
        '3cd741da-aa57-4cc3-8530-667e8b7bad78',
      );
      expect(toTransaction.transactionType.accordionTitle).toBe('ENTER DATA');
      expect(toTransaction.fields_to_validate?.includes('memo_code')).toBeFalse();
      expect(toTransaction.reatt_redes_id).toBe(origTransaction.id);
    });
  });
});
