import { FormGroup, Validators } from '@angular/forms';
import { SchBTransaction, ScheduleBTransactionTypes } from '../../models/schb-transaction.model';
import { getTestTransactionByType, testScheduleBTransaction } from '../unit-test.utils';
import { RedesignationFromUtils } from './redesignation-from.utils';
import { SubscriptionFormControl } from '../subscription-form-control';

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

  describe('overlayForm', () => {
    it('should update validators and watch for value changes', () => {
      const transaction = { ...testScheduleBTransaction } as SchBTransaction;
      transaction.parent_transaction = {
        id: '888',
        reatt_redes: SchBTransaction.fromJSON({
          id: '999',
          expenditure_amount: 100,
        }),
      } as unknown as SchBTransaction;

      const fromForm = new FormGroup(
        {
          expenditure_amount: new SubscriptionFormControl<number | null>(null),
          memo_code: new SubscriptionFormControl(''),
          expenditure_purpose_descrip: new SubscriptionFormControl(''),
        },
        { updateOn: 'blur' },
      );
      const toForm = new FormGroup(
        {
          payee_organization_name: new SubscriptionFormControl('a'),
          payee_last_name: new SubscriptionFormControl(''),
          payee_first_name: new SubscriptionFormControl(''),
          expenditure_amount: new SubscriptionFormControl('100'),
          expenditure_purpose_descrip: new SubscriptionFormControl(''),
        },
        { updateOn: 'blur' },
      );

      expect(fromForm.get('expenditure_purpose_descrip')?.enabled).toBeTrue();
      RedesignationFromUtils.overlayForm(fromForm, transaction, toForm);
      expect(fromForm.get('expenditure_purpose_descrip')?.enabled).toBeFalse();
      expect(fromForm.get('memo_code')?.hasValidator(Validators.requiredTrue)).toBeTrue();
      expect(fromForm.get('memo_code')?.value).toBeTrue();

      toForm.get('expenditure_amount')?.setValue('5');
      expect(fromForm.get('expenditure_amount')?.value).toBe(-5);
    });
  });
});
