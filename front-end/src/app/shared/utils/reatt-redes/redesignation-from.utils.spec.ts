import { SchBTransaction, ScheduleBTransactionTypes } from '../../models/schb-transaction.model';
import { getTestTransactionByType, testScheduleBTransaction } from '../unit-test.utils';
import { RedesignationFromUtils } from './redesignation-from.utils';

describe('Redesignation From', () => {
  describe('overlayTransactionProperties', () => {
    it('should override default properties', () => {
      const fromTransaction = RedesignationFromUtils.overlayTransactionProperties(
        getTestTransactionByType(ScheduleBTransactionTypes.OPERATING_EXPENDITURE) as SchBTransaction,
        testScheduleBTransaction,
        '3cd741da-aa57-4cc3-8530-667e8b7bad78',
      );
      expect(fromTransaction.transactionType.accordionTitle).toBe('AUTO-POPULATED');
      expect(fromTransaction.fields_to_validate?.includes('memo_code')).toBeFalse();
      expect(fromTransaction.reatt_redes_id).toBe(testScheduleBTransaction.id);
    });
  });
});
