import { getTestTransactionByType, testScheduleBTransaction } from '../unit-test.utils';
import { FormControl, FormGroup } from '@angular/forms';
import { SchBTransaction, ScheduleBTransactionTypes } from '../../models/schb-transaction.model';
import { RedesignationFromUtils } from './redesignation-from.utils';
import { DateUtils } from '../date.utils';

describe('Redesignation From', () => {
  describe('overlayTransactionProperties', () => {
    it('should override default properties', () => {
      const reattRedes = getTestTransactionByType(ScheduleBTransactionTypes.OPERATING_EXPENDITURE) as SchBTransaction;
      const expenditureDate = new Date();
      reattRedes.expenditure_date = expenditureDate;
      const fromTransaction = RedesignationFromUtils.overlayTransactionProperties(
        reattRedes,
        testScheduleBTransaction,
        '3cd741da-aa57-4cc3-8530-667e8b7bad78',
      );
      expect(fromTransaction.transactionType.accordionTitle).toBe('AUTO-POPULATED');
      expect(fromTransaction.fields_to_validate?.includes('memo_code')).toBeFalse();
      expect(fromTransaction.reatt_redes_id).toBe(testScheduleBTransaction.id);
      if (fromTransaction.transactionType.generatePurposeDescription) {
        const testTransaction = getTestTransactionByType(
          ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
        ) as SchBTransaction;
        testTransaction.reatt_redes = reattRedes;
        expect(fromTransaction.transactionType.generatePurposeDescription(testTransaction)).toBe(
          `Redesignation - Contribution from ${DateUtils.convertDateToSlashFormat(expenditureDate)}`,
        );
      }
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

      const fromForm = new FormGroup({
        expenditure_amount: new FormControl<number | null>(null),
        memo_code: new FormControl(''),
        expenditure_purpose_descrip: new FormControl(''),
      });
      const toForm = new FormGroup({
        payee_organization_name: new FormControl('a'),
        payee_last_name: new FormControl(''),
        payee_first_name: new FormControl(''),
        expenditure_amount: new FormControl('100'),
        expenditure_purpose_descrip: new FormControl(''),
      });

      expect(fromForm.get('expenditure_purpose_descrip')?.enabled).toBeTrue();
      RedesignationFromUtils.overlayForm(fromForm, transaction, toForm);
      expect(fromForm.get('expenditure_purpose_descrip')?.enabled).toBeFalse();

      toForm.get('expenditure_amount')?.setValue('5');
      expect(fromForm.get('expenditure_amount')?.value).toBe(-5);
    });
  });
});
