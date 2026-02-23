import { ReattributionToUtils } from './reattribution-to.utils';
import { getTestTransactionByType, testScheduleATransaction } from 'app/shared/utils/unit-test.utils';
import { FormGroup } from '@angular/forms';
import { SubscriptionFormControl } from '../subscription-form-control';
import { ScheduleATransactionTypes } from 'app/shared/models/type-enums';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';

describe('Reattribution To', () => {
  describe('overlayTransactionProperties', () => {
    it('should override default properties', async () => {
      const origTransaction = await testScheduleATransaction();
      const toTransaction = ReattributionToUtils.overlayTransactionProperties(
        (await getTestTransactionByType(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT)) as SchATransaction,
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
      const transaction = await testScheduleATransaction();
      transaction.reatt_redes = {
        id: '999',
        report_ids: ['999'],
        contribution_amount: 100,
      } as unknown as SchATransaction;
      const toForm = new FormGroup(
        {
          contribution_purpose_descrip: new SubscriptionFormControl(''),
          memo_code: new SubscriptionFormControl(''),
        },
        { updateOn: 'blur' },
      );

      ReattributionToUtils.overlayForm(toForm, transaction);
      expect(toForm.get('memo_code')?.value).toBeTrue();

      transaction.report_ids = ['999'];
      ReattributionToUtils.overlayForm(toForm, transaction);
      expect(toForm.get('memo_code')?.value).toBeTrue();
    });
  });
});
