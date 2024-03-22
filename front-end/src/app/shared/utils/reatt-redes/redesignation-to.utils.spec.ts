import { getTestTransactionByType, testScheduleBTransaction } from '../unit-test.utils';
import { FormControl, FormGroup } from '@angular/forms';
import { RedesignationToUtils } from './redesignation-to.utils';
import { SchBTransaction, ScheduleBTransactionTypes } from '../../models/schb-transaction.model';

describe('RedesignationToUtils', () => {
  describe('overlayTransactionProperties', () => {
    it('should override default properties', () => {
      const origTransaction = { ...testScheduleBTransaction } as SchBTransaction;
      const toTransaction = RedesignationToUtils.overlayTransactionProperties(
        getTestTransactionByType(ScheduleBTransactionTypes.OPERATING_EXPENDITURE) as SchBTransaction,
        origTransaction,
        '3cd741da-aa57-4cc3-8530-667e8b7bad78',
      );
      expect(toTransaction.transactionType.accordionTitle).toBe('ENTER DATA');
      expect(toTransaction.fields_to_validate?.includes('memo_code')).toBeFalse();
      expect(toTransaction.reatt_redes_id).toBe(origTransaction.id);
    });
  });

  describe('overlayForm', () => {
    it('should update validators and watch for value changes', () => {
      const transaction = { ...testScheduleBTransaction } as SchBTransaction;
      transaction.reatt_redes = {
        id: '999',
        report_id: '999',
        contribution_amount: 100,
      } as unknown as SchBTransaction;
      const toForm = new FormGroup({
        contribution_purpose_descrip: new FormControl(''),
        memo_code: new FormControl(''),
      });

      RedesignationToUtils.overlayForm(toForm, transaction);
      expect(toForm.get('memo_code')?.value).toBeTrue();

      transaction.report_ids = ['999'];
      RedesignationToUtils.overlayForm(toForm, transaction);
      expect(toForm.get('memo_code')?.value).toBeTrue();
    });
  });
});
