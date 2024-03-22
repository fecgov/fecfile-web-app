import { SchBTransaction } from '../../models/schb-transaction.model';
import { RedesignatedUtils } from './redesignated.utils';
import { ReattRedesTypes, ReattRedesUtils } from './reatt-redes.utils';
import { testScheduleBTransaction } from '../unit-test.utils';
import { F3xReportCodes } from '../report-code.utils';

describe('Redesignated Utils', () => {
  let payload: SchBTransaction;

  beforeEach(() => {
    payload = SchBTransaction.fromJSON({
      ...testScheduleBTransaction,
    });
    payload.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATION_TO;
    payload.reatt_redes = SchBTransaction.fromJSON({
      ...testScheduleBTransaction,
    });
  });
  describe('overlayTransactionProperties', () => {
    let data;
    it('should handle a different report', () => {
      if (!payload.reatt_redes || !(payload.reatt_redes instanceof SchBTransaction)) throw new Error('Bad test setup');
      expect(payload.reatt_redes.getForm3X()?.reportCode).toBe(F3xReportCodes.Q1);
      const overlay = RedesignatedUtils.overlayTransactionProperties(
        payload.reatt_redes,
        'not-the-same-report-as-orig',
      );
      expect(overlay.expenditure_purpose_descrip).toBe(
        '(Originally disclosed on APRIL 15 QUARTERLY REPORT (Q1).) See redesignation below.',
      );
    });

    it('should filter out "expenditure_purpose_descrip" from the transaction fields to validate', () => {
      data = {
        id: '999',
        form_type: 'SA11Ai',
        payee_organization_name: 'foo',
        expenditure_date: undefined,
        expenditure_purpose_descrip: '',
        fields_to_validate: ['abc', 'expenditure_purpose_descrip'],
      };
      payload = SchBTransaction.fromJSON(data);
      expect(payload.fields_to_validate?.length).toBe(2);
      payload = RedesignatedUtils.overlayTransactionProperties(payload);
      expect(payload.fields_to_validate?.length).toBe(1);
    });

    it('should alert if transaction has reattribution_redesignation_tag but is not the current report', () => {
      data = {
        id: '999',
        form_type: 'SA11Ai',
        payee_organization_name: 'foo',
        expenditure_date: undefined,
        fields_to_validate: ['abc', 'expenditure_purpose_descrip'],
        report_ids: ['1'],
      };
      payload = SchBTransaction.fromJSON(data);
      payload = RedesignatedUtils.overlayTransactionProperties(payload, '2');
    });

    it('should update description and set tag to Redesignated', () => {
      data = {
        id: '999',
        form_type: 'SA11Ai',
        payee_organization_name: 'foo',
        expenditure_date: undefined,
        fields_to_validate: ['abc', 'expenditure_purpose_descrip'],
        report_ids: ['1'],
      };
      payload = SchBTransaction.fromJSON(data);
      payload = RedesignatedUtils.overlayTransactionProperties(payload, '1');
      expect(payload.expenditure_purpose_descrip).toEqual('See redesignation below.');
      expect(payload.reattribution_redesignation_tag).toEqual(ReattRedesTypes.REDESIGNATED);
    });

    it('should update the memo', () => {
      const updateMemoSpy = spyOn(ReattRedesUtils, 'updateMemo').and.callThrough();
      data = {
        id: '999',
        form_type: 'SA11Ai',
        payee_organization_name: 'foo',
        expenditure_date: undefined,
        fields_to_validate: ['abc', 'expenditure_purpose_descrip'],
        report_ids: ['1'],
        expenditure_purpose_descrip: 'PURPOSE',
        text4000: 'MEMO',
      };
      payload = SchBTransaction.fromJSON(data);
      payload = RedesignatedUtils.overlayTransactionProperties(payload, '1');
      expect(payload.memo_text).toBeTruthy();
      expect(updateMemoSpy).toHaveBeenCalled();
    });
  });
});
