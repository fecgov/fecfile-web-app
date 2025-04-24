import { ReattributionFromUtils } from './reattribution-from.utils';
import { getTestTransactionByType, testScheduleATransaction } from 'app/shared/utils/unit-test.utils';
import { SchATransaction, ScheduleATransactionTypes } from '../../models/scha-transaction.model';

describe('Reattribution From', () => {
  describe('overlayTransactionProperties', () => {
    it('should override default properties', () => {
      const fromTransaction = ReattributionFromUtils.overlayTransactionProperties(
        getTestTransactionByType(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT) as SchATransaction,
        testScheduleATransaction,
        '3cd741da-aa57-4cc3-8530-667e8b7bad78',
      );
      expect(fromTransaction.transactionType.accordionTitle).toBe('AUTO-POPULATED');
      expect(fromTransaction.fields_to_validate?.includes('memo_code')).toBeFalse();
      expect(fromTransaction.reatt_redes_id).toBe(testScheduleATransaction.id);
    });
  });
});
