import { SchATransaction } from '../../models/scha-transaction.model';
import { testScheduleATransaction } from '../unit-test.utils';
import { ReattributedUtils } from './reattributed.utils';
import _ from 'lodash';
import { ReattRedesTypes } from './reatt-redes.utils';

describe('Reattributed Utils', () => {
  let payload: SchATransaction;
  beforeEach(() => {
    payload = SchATransaction.fromJSON({
      ...testScheduleATransaction,
    });
    payload.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTION_TO;

    payload.reatt_redes = SchATransaction.fromJSON({
      ...testScheduleATransaction,
    });
  });
  describe('getPayload', () => {
    it('should throw error when originating missing transaction type', () => {
      if (!payload.reatt_redes) throw new Error('Bad test setup');
      payload.reatt_redes.transaction_type_identifier = undefined;
      expect(function () {
        ReattributedUtils.getPayload(payload);
      }).toThrow(Error('Fecfile online: originating reattribution transaction type not found.'));
    });

    it('should clone to make reattributed', () => {
      const cloneSpy = spyOn(_, 'cloneDeep').and.callThrough();
      if (!payload.reatt_redes) throw new Error('Bad test setup');
      payload.reatt_redes = ReattributedUtils.overlayTransactionProperties(payload.reatt_redes as SchATransaction);
      if (!payload.reatt_redes || !(payload.reatt_redes instanceof SchATransaction)) throw new Error('Bad test setup');
      expect(payload.reatt_redes.reattribution_redesignation_tag).toBe(ReattRedesTypes.REATTRIBUTED);
      const reattributed = ReattributedUtils.getPayload(payload);
      expect(cloneSpy).toHaveBeenCalledWith(payload.reatt_redes);
      expect(reattributed.report_id).toEqual(payload.report_id);
      expect(reattributed.report).toBeFalsy();
      expect(reattributed.id).toBeFalsy();
      expect(reattributed.reattribution_redesignation_tag).toBe(ReattRedesTypes.REATTRIBUTED);
      expect(reattributed.force_unaggregated).toBeTrue();
    });
  });

  describe('overlayTransactionProperties', () => {
    it('should handle a different report', () => {
      if (!payload.reatt_redes || !(payload.reatt_redes instanceof SchATransaction)) throw new Error('Bad test setup');
      const overlay = ReattributedUtils.overlayTransactionProperties(
        payload.reatt_redes,
        'not-the-same-report-as-orig',
      );
      expect(overlay.report).toBeTruthy();
      if (!overlay.report) throw new Error('');
      expect(overlay.contribution_purpose_descrip).toBe(
        `(Originally disclosed on APRIL 15 QUARTERLY REPORT (Q1).) See reattribution below.`,
      );
    });
  });
});
