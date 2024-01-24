import { SchBTransaction } from '../../models/schb-transaction.model';
import { RedesignatedUtils } from './redesignated.utils';
import { ReattRedesTypes } from './reatt-redes.utils';
import { MemoText } from 'app/shared/models/memo-text.model';

describe('Redesignated Utils', () => {
  describe('overlayTransactionProperties', () => {
    let data: unknown;
    let transaction: SchBTransaction;
    it('should filter out "expenditure_purpose_descrip" from the transaction fields to validate', () => {
      data = {
        id: '999',
        form_type: 'SA11Ai',
        payee_organization_name: 'foo',
        expenditure_date: undefined,
        expenditure_purpose_descrip: '',
        fields_to_validate: ['abc', 'expenditure_purpose_descrip'],
      };
      transaction = SchBTransaction.fromJSON(data);
      expect(transaction.fields_to_validate?.length).toBe(2);
      transaction = RedesignatedUtils.overlayTransactionProperties(transaction);
      expect(transaction.fields_to_validate?.length).toBe(1);
    });

    it('should alert if transaction has reattribution_redesignation_tag but is not the current report', () => {
      spyOn(window, 'alert');
      data = {
        id: '999',
        form_type: 'SA11Ai',
        payee_organization_name: 'foo',
        expenditure_date: undefined,
        fields_to_validate: ['abc', 'expenditure_purpose_descrip'],
        report_id: '1',
      };
      transaction = SchBTransaction.fromJSON(data);
      transaction = RedesignatedUtils.overlayTransactionProperties(transaction, '2');
      expect(window.alert).toHaveBeenCalledTimes(1);
    });

    it('should update description and set tag to Redesignated', () => {
      data = {
        id: '999',
        form_type: 'SA11Ai',
        payee_organization_name: 'foo',
        expenditure_date: undefined,
        fields_to_validate: ['abc', 'expenditure_purpose_descrip'],
        report_id: '1',
      };
      transaction = SchBTransaction.fromJSON(data);
      transaction = RedesignatedUtils.overlayTransactionProperties(transaction, '1');
      expect(transaction.expenditure_purpose_descrip).toEqual('See redesignation below.');
      expect(transaction.reattribution_redesignation_tag).toEqual(ReattRedesTypes.REDESIGNATED);
    });

    it('should preserve the purpose description in the memo text prefix', () => {
      const data = {
        id: '999',
        form_type: 'SA11Ai',
        payee_organization_name: 'foo',
        expenditure_date: undefined,
        memo_text: undefined as MemoText | undefined,
        expenditure_purpose_descrip: 'PURPOSE',
        fields_to_validate: ['abc', 'expenditure_purpose_descrip'],
        report_id: '1',
      };
      transaction = SchBTransaction.fromJSON(data);
      transaction = RedesignatedUtils.overlayTransactionProperties(transaction, '1');
      expect(transaction.memo_text?.text_prefix).toEqual('[Original purpose description: PURPOSE] ');
      expect(transaction.memo_text?.text4000).toEqual('[Original purpose description: PURPOSE] ');

      data.memo_text = MemoText.fromJSON({
        text4000: 'MEMO',
      });
      transaction = SchBTransaction.fromJSON(data);
      transaction = RedesignatedUtils.overlayTransactionProperties(transaction, '1');
      expect(transaction.memo_text?.text_prefix).toEqual('[Original purpose description: PURPOSE] ');
      expect(transaction.memo_text?.text4000).toEqual('[Original purpose description: PURPOSE] MEMO');
    });
  });
});
