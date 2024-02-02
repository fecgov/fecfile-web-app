import { SchBTransaction } from '../../models/schb-transaction.model';
import { RedesignatedUtils } from './redesignated.utils';
import { ReattRedesTypes } from './reatt-redes.utils';
import _ from 'lodash';
import { testScheduleBTransaction } from '../unit-test.utils';

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
      payload.reattribution_redesignation_tag = undefined;
      const overlay = RedesignatedUtils.overlayTransactionProperties(payload, 'not-the-same-report-as-orig');
      expect(overlay.expenditure_purpose_descrip).toBe(
        '(Originally disclosed on FEBRUARY 20 (M2).) See redesignation below.',
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
        report_id: '1',
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
        report_id: '1',
      };
      payload = SchBTransaction.fromJSON(data);
      payload = RedesignatedUtils.overlayTransactionProperties(payload, '1');
      expect(payload.expenditure_purpose_descrip).toEqual('See redesignation below.');
      expect(payload.reattribution_redesignation_tag).toEqual(ReattRedesTypes.REDESIGNATED);
    });
  });

  describe('getPayload', () => {
    it('should throw error when originating missing transaction type', () => {
      if (!payload.reatt_redes) throw new Error('Bad test setup');
      payload.reatt_redes.transaction_type_identifier = undefined;
      expect(function () {
        RedesignatedUtils.getPayload(payload);
      }).toThrow(Error('Fecfile online: originating redesignation transaction type not found.'));
    });

    it('should clone to make reattributed', () => {
      const cloneSpy = spyOn(_, 'cloneDeep').and.callThrough();
      if (!payload.reatt_redes) throw new Error('Bad test setup');
      payload.reatt_redes = RedesignatedUtils.overlayTransactionProperties(payload.reatt_redes as SchBTransaction);
      const redesignated = RedesignatedUtils.getPayload(payload);
      expect(cloneSpy).toHaveBeenCalledWith(payload.reatt_redes);
      expect(redesignated.report_id).toEqual(payload.report_id);
      expect(redesignated.report).toBeFalsy();
      expect(redesignated.id).toBeFalsy();
      expect(redesignated.reattribution_redesignation_tag).toBe(ReattRedesTypes.REDESIGNATED);
      expect(redesignated.force_unaggregated).toBeTrue();
    });
  });
});
