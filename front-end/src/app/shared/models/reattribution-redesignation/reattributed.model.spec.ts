import { SchATransaction } from '../scha-transaction.model';
import { Reattributed } from './reattributed.model';
import { testScheduleATransaction } from 'app/shared/utils/unit-test.utils';

describe('Reattributed', () => {
  let reattributed = new Reattributed();

  beforeEach(() => {
    reattributed = new Reattributed();
  });

  it('should create an instance', () => {
    expect(reattributed).toBeTruthy();
  });

  it('overlayTransactionProperties should override default properties', () => {
    const transaction = { ...testScheduleATransaction } as SchATransaction;
    let overlay = reattributed.overlayTransactionProperties(transaction, '3cd741da-aa57-4cc3-8530-667e8b7bad78');
    expect(overlay.fields_to_validate?.includes('contribution_purpose_descrip')).toBeFalse();
    expect(overlay.contribution_purpose_descrip).toBe('See reattribution below.');

    overlay = reattributed.overlayTransactionProperties(transaction, 'not-the-same-report-as-orig');
    expect(overlay.report_id).toBe('not-the-same-report-as-orig');
    expect(overlay.contribution_purpose_descrip).toBe('(Originally disclosed on M1.) See attribution below.');
  });
});
