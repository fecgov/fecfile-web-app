import { ReattributionTo } from './reattribution-to.model';
import { testScheduleATransaction } from 'app/shared/utils/unit-test.utils';
import { FormGroup, FormControl } from '@angular/forms';
import { SchATransaction } from '../scha-transaction.model';

describe('Reattribution To', () => {
  let reattributionTo = new ReattributionTo();

  beforeEach(() => {
    reattributionTo = new ReattributionTo();
  });

  it('should create an instance', () => {
    expect(reattributionTo).toBeTruthy();
  });

  it('overlayTransactionProperties should override default properties', () => {
    const origTransaction = { ...testScheduleATransaction } as SchATransaction;
    const toTransaction = reattributionTo.overlayTransactionProperties(
      origTransaction,
      '3cd741da-aa57-4cc3-8530-667e8b7bad78'
    );
    expect(toTransaction.transactionType.accordionTitle).toBe('ENTER DATA');
    expect(toTransaction.fields_to_validate?.includes('memo_code')).toBeFalse();
    expect(toTransaction.reatt_redes_id).toBe(origTransaction.id);
  });

  it('overlayForm() should update validators and watch for value changes', () => {
    const transaction = { ...testScheduleATransaction } as SchATransaction;
    transaction.reatt_redes = {
      id: '999',
      report_id: '999',
      contribution_amount: 100,
    } as unknown as SchATransaction;
    const toForm = new FormGroup({
      contribution_purpose_descrip: new FormControl(''),
      memo_code: new FormControl(''),
    });

    reattributionTo.overlayForm(toForm, transaction);
    expect(toForm.get('memo_code')?.value).toBeTrue();

    transaction.report_id = '999';
    reattributionTo.overlayForm(toForm, transaction);
    expect(toForm.get('memo_code')?.value).toBeFalse();
  });
});
