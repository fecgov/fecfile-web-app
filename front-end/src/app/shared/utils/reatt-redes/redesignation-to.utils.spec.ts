import { getTestTransactionByType, testScheduleBTransaction } from '../unit-test.utils';
import { FormGroup } from '@angular/forms';
import { RedesignationToUtils } from './redesignation-to.utils';
import { SubscriptionFormControl } from '../subscription-form-control';
import { SchBTransaction } from 'app/shared/models/schb-transaction.model';
import { ScheduleBTransactionTypes } from 'app/shared/models/type-enums';

describe('RedesignationToUtils', () => {
  describe('overlayTransactionProperties', () => {
    it('should override default properties', async () => {
      const origTransaction = await testScheduleBTransaction();
      const toTransaction = RedesignationToUtils.overlayTransactionProperties(
        (await getTestTransactionByType(ScheduleBTransactionTypes.OPERATING_EXPENDITURE)) as SchBTransaction,
        origTransaction,
        '3cd741da-aa57-4cc3-8530-667e8b7bad78',
      );
      expect(toTransaction.transactionType.accordionTitle).toBe('STEP ONE');
      expect(toTransaction.fields_to_validate?.includes('memo_code')).toBeFalse();
      expect(toTransaction.reatt_redes_id).toBe(origTransaction.id);
    });
  });

  describe('overlayForm', () => {
    it('should update validators and watch for value changes', async () => {
      const transaction = await testScheduleBTransaction();
      transaction.reatt_redes = {
        id: '999',
        report_id: '999',
        contribution_amount: 100,
      } as unknown as SchBTransaction;
      const toForm = new FormGroup(
        {
          contribution_purpose_descrip: new SubscriptionFormControl(''),
          memo_code: new SubscriptionFormControl(''),
        },
        { updateOn: 'blur' },
      );

      RedesignationToUtils.overlayForm(toForm, transaction);
      expect(toForm.get('memo_code')?.value).toBeTrue();

      transaction.report_ids = ['999'];
      RedesignationToUtils.overlayForm(toForm, transaction);
      expect(toForm.get('memo_code')?.value).toBeTrue();
    });
  });
});
