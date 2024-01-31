import { SchATransaction } from '../../models/scha-transaction.model';
import { testScheduleATransaction } from '../unit-test.utils';
import { ReattributedUtils } from './reattributed.utils';
import _ from 'lodash';
import { ReattRedesTypes } from './reatt-redes.utils';

describe('Reattributed', () => {
  let payload: SchATransaction;
  let originatingTransaction: SchATransaction;
  beforeEach(() => {
    payload = SchATransaction.fromJSON({
      ...testScheduleATransaction,
    });
    originatingTransaction = SchATransaction.fromJSON({
      ...testScheduleATransaction,
    });
    payload.reatt_redes = SchATransaction.fromJSON({
      ...testScheduleATransaction,
    });
  });
  describe('getPayload', () => {
    it('should throw error when originating missing transaction type', () => {
      originatingTransaction.transaction_type_identifier = undefined;
      expect(function () {
        ReattributedUtils.getPayload(payload, originatingTransaction);
      }).toThrow(Error('Fecfile online: originating reattribution transaction type not found.'));
    });

    it('should clone to make reattributed', () => {
      const cloneSpy = spyOn(_, 'cloneDeep').and.callThrough();
      const reattributed = ReattributedUtils.getPayload(payload, originatingTransaction);
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
      const transaction = { ...testScheduleATransaction } as SchATransaction;
      transaction.reattribution_redesignation_tag = undefined;
      const overlay = ReattributedUtils.overlayTransactionProperties(
        transaction,
        'not-the-same-report-as-orig',
      ) as SchATransaction;
      expect(overlay.report_id).toBe('not-the-same-report-as-orig');
      expect(overlay.contribution_purpose_descrip).toBe('(Originally disclosed on M1.) See attribution below.');
    });
  });
});
