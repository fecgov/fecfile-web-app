import { ReattributionFrom } from './reattribution-from.model';
import { getTestTransactionByType, testScheduleATransaction } from 'app/shared/utils/unit-test.utils';
import { FormGroup, FormControl } from '@angular/forms';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('Reattribution From', () => {
  let reattributionFrom = new ReattributionFrom();

  beforeEach(() => {
    reattributionFrom = new ReattributionFrom();
  });

  it('should create an instance', () => {
    expect(reattributionFrom).toBeTruthy();
  });

  it('overlayTransactionProperties should override default properties', () => {
    const fromTransaction = reattributionFrom.overlayTransactionProperties(
      getTestTransactionByType(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT) as SchATransaction,
      testScheduleATransaction,
      '3cd741da-aa57-4cc3-8530-667e8b7bad78'
    );
    expect(fromTransaction.transactionType.accordionTitle).toBe('AUTO-POPULATED');
    expect(fromTransaction.fields_to_validate?.includes('memo_code')).toBeFalse();
    expect(fromTransaction.reatt_redes_id).toBe(testScheduleATransaction.id);
  });

  it('overlayForm() should update validators and watch for value changes', () => {
    const transaction = { ...testScheduleATransaction } as SchATransaction;
    transaction.parent_transaction = {
      id: '888',
      reatt_redes: {
        id: '999',
        contribution_amount: 100,
      } as SchATransaction,
    } as unknown as SchATransaction;
    const fromForm = new FormGroup({
      contribution_purpose_descrip: new FormControl(''),
      memo_code: new FormControl(''),
      contribution_amount: new FormControl(''),
    });
    const toForm = new FormGroup({
      contributor_organization_name: new FormControl('a'),
      contributor_last_name: new FormControl(''),
      contributor_first_name: new FormControl(''),
      contribution_amount: new FormControl('100'),
    });

    expect(fromForm.get('contribution_purpose_descrip')?.enabled).toBeTrue();
    reattributionFrom.overlayForm(fromForm, transaction, toForm);
    expect(fromForm.get('contribution_purpose_descrip')?.enabled).toBeFalse();

    toForm.get('contribution_amount')?.setValue(5 as never);
    expect(fromForm.get('contribution_amount')?.value).toBe(-5 as never);
  });
});
