import { MemoText } from 'app/shared/models/memo-text.model';
import { SchATransaction } from '../../models/scha-transaction.model';
import { ReattributedUtils } from './reattributed.utils';
import { testScheduleATransaction } from 'app/shared/utils/unit-test.utils';

describe('Reattributed', () => {
  let transaction: SchATransaction;
  it('overlayTransactionProperties should override default properties', () => {
    const transaction = { ...testScheduleATransaction } as SchATransaction;
    const overlay = ReattributedUtils.overlayTransactionProperties(transaction, '3cd741da-aa57-4cc3-8530-667e8b7bad78');
    expect(overlay.fields_to_validate?.includes('contribution_purpose_descrip')).toBeFalse();
    expect(overlay.contribution_purpose_descrip).toBe('See reattribution below.');

    // overlay = ReattributedUtils.overlayTransactionProperties(transaction, 'not-the-same-report-as-orig');
    // expect(overlay.report_id).toBe('not-the-same-report-as-orig');
    // expect(overlay.contribution_purpose_descrip).toBe('(Originally disclosed on M1.) See attribution below.');
  });

  it('should preserve the purpose description in the memo text prefix', () => {
    const data = {
      id: '999',
      form_type: 'SA11Ai',
      organization_name: 'foo',
      contribution_date: undefined,
      memo_text: undefined as MemoText | undefined,
      contribution_purpose_descrip: 'PURPOSE',
      fields_to_validate: ['abc', 'contribution_purpose_descrip'],
      report_id: '1',
    };
    transaction = SchATransaction.fromJSON(data);
    transaction = ReattributedUtils.overlayTransactionProperties(transaction, '1');
    expect(transaction.memo_text?.text_prefix).toEqual('[Original purpose description: PURPOSE] ');
    expect(transaction.memo_text?.text4000).toEqual('[Original purpose description: PURPOSE] ');

    data.memo_text = MemoText.fromJSON({
      text4000: 'MEMO',
    });
    transaction = SchATransaction.fromJSON(data);
    transaction = ReattributedUtils.overlayTransactionProperties(transaction, '1');
    expect(transaction.memo_text?.text_prefix).toEqual('[Original purpose description: PURPOSE] ');
    expect(transaction.memo_text?.text4000).toEqual('[Original purpose description: PURPOSE] MEMO');
  });
});
