import { ReattributionFromUtils } from './reattribution-from.utils';
import { getTestTransactionByType, testScheduleATransaction } from 'app/shared/utils/unit-test.utils';
import { FormGroup } from '@angular/forms';
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

  // describe('overlayForm', () => {
  //   it('should update validators and watch for value changes', () => {
  //     const transaction = { ...testScheduleATransaction } as SchATransaction;
  //     transaction.parent_transaction = {
  //       id: '888',
  //       reatt_redes: {
  //         id: '999',
  //         contribution_amount: 100,
  //       } as SchATransaction,
  //     } as unknown as SchATransaction;
  //     const fromForm = new FormGroup(
  //       {
  //         contribution_purpose_descrip: new SignalFormControl(injector, ''),
  //         memo_code: new SignalFormControl(injector, ''),
  //         contribution_amount: new SignalFormControl(injector, ''),
  //       },
  //       { updateOn: 'blur' },
  //     );
  //     const toForm = new FormGroup(
  //       {
  //         contributor_organization_name: new SignalFormControl(injector, 'a'),
  //         contributor_last_name: new SignalFormControl(injector, ''),
  //         contributor_first_name: new SignalFormControl(injector, ''),
  //         contribution_amount: new SignalFormControl(injector, '100'),
  //       },
  //       { updateOn: 'blur' },
  //     );

  //     expect(fromForm.get('contribution_purpose_descrip')?.enabled).toBeTrue();
  //     ReattributionFromUtils.overlayForm(fromForm, transaction, toForm);
  //     expect(fromForm.get('contribution_purpose_descrip')?.enabled).toBeFalse();

  //     toForm.get('contribution_amount')?.setValue(5 as never);
  //     expect(fromForm.get('contribution_amount')?.value).toBe(-5 as never);
  //   });
  // });
});
