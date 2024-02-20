import { SchATransaction } from '../../models/scha-transaction.model';
import { testScheduleATransaction } from '../unit-test.utils';
import { ReattributedUtils } from './reattributed.utils';
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
