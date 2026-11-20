import { getTestTransactionByType, testScheduleATransaction, testScheduleBTransaction } from '../unit-test.utils';
import { FormGroup } from '@angular/forms';
import { RedesignationToUtils } from './redesignation-to.utils';
import { SchBTransaction, ScheduleBTransactionTypes } from '../../models/schb-transaction.model';
import { SubscriptionFormControl } from '../subscription-form-control';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';

describe('RedesignationToUtils', () => {
  describe('overlayTransactionProperties', () => {
    it('should override default properties', () => {
      const origTransaction = testScheduleBTransaction();

      const toTransaction = RedesignationToUtils.overlayTransactionProperties(
        getTestTransactionByType(ScheduleBTransactionTypes.OPERATING_EXPENDITURE) as SchBTransaction,
        origTransaction,
        '3cd741da-aa57-4cc3-8530-667e8b7bad78',
      ) as SchBTransaction;
      expect(toTransaction.transactionType.accordionTitle).toBe('STEP ONE');
      expect(toTransaction.fields_to_validate?.includes('memo_code')).toBe(false);
      expect(toTransaction.reatt_redes_id).toBe(origTransaction.id);
      expect(toTransaction.transactionType.generatePurposeDescription).toBeDefined();
      if (toTransaction.transactionType.generatePurposeDescription) {
        expect(toTransaction.transactionType.generatePurposeDescription(toTransaction)).toBe(
          'Redesignation - Contribution from 08/11/2022',
        );
      }
    });

    it('should work with Schedule A', () => {
      const transaction = testScheduleATransaction();

      const toTransaction = RedesignationToUtils.overlayTransactionProperties(
        getTestTransactionByType(ScheduleATransactionTypes.CONTRIBUTION_FROM_CANDIDATE) as SchATransaction,
        transaction,
        '123741da-aa57-4cc3-8530-667e8b712378',
      ) as SchATransaction;
      expect(toTransaction.reatt_redes_id).toBe(transaction.id);
      expect(toTransaction.transactionType.generatePurposeDescription).toBeDefined();
      if (toTransaction.transactionType.generatePurposeDescription) {
        expect(toTransaction.transactionType.generatePurposeDescription(toTransaction)).toBe(
          'Redesignation - Contribution from 08/11/2022',
        );
      }
    });
  });

  describe('overlayForm', () => {
    it('should update validators and watch for value changes', () => {
      const transaction = testScheduleBTransaction();
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
      expect(toForm.get('memo_code')?.value).toBe(true);

      transaction.report_ids = ['999'];
      RedesignationToUtils.overlayForm(toForm, transaction);
      expect(toForm.get('memo_code')?.value).toBe(true);
    });
  });
});
