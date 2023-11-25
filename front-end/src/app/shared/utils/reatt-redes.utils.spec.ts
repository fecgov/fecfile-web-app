import { ReattRedesTypes } from '../models/reattribution-redesignation/reattribution-redesignation-base.model';
import { SchATransaction } from '../models/scha-transaction.model';
import { FormGroup, FormControl } from '@angular/forms';
import { ReattRedesUtils } from './reatt-redes.utils';
import { testIndividualReceipt } from './unit-test.utils';

describe('ReattRedesUtils', () => {
  it('should create an instance', () => {
    expect(new ReattRedesUtils()).toBeTruthy();
  });

  it('should test if transaction is reatt/redes', () => {
    const txn = { ...testIndividualReceipt } as SchATransaction;
    let result = ReattRedesUtils.isReattRedes(txn, [ReattRedesTypes.REATTRIBUTED]);
    expect(result).toBeFalse();
    txn.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTED;
    result = ReattRedesUtils.isReattRedes(txn, [ReattRedesTypes.REATTRIBUTED]);
    expect(result).toBeTrue();
  });

  xit('should overlay forms correctly', () => {
    const toTxn = { ...testIndividualReceipt } as SchATransaction;
    toTxn.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTION_TO;
    const toForm = new FormGroup({
      contribution_purpose_descip: new FormControl(''),
      memo_code: new FormControl(''),
    });
    const fromTxn = { ...testIndividualReceipt } as SchATransaction;
    fromTxn.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTION_FROM;
    const fromForm = new FormGroup({
      contribution_purpose_descrip: new FormControl(''),
      memo_code: new FormControl(''),
      contributor_organization_name: new FormControl(''),
      contributor_last_name: new FormControl(''),
      contributor_first_name: new FormControl(''),
    });

    ReattRedesUtils.overlayForms(toForm, toTxn, fromForm, fromTxn);
    expect(toForm.get('memo_code')?.enabled).toBeFalse();
    expect(fromForm.get('contribution_purpose_descrip')?.enabled).toBeFalse();
  });

  it('should reorder payload correctly', () => {
    const reattributed = { ...testIndividualReceipt } as SchATransaction;
    reattributed.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTED;
    const toTxn = { ...testIndividualReceipt } as SchATransaction;
    toTxn.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTION_TO;
    const fromTxn = { ...testIndividualReceipt } as SchATransaction;
    fromTxn.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTION_FROM;

    const payload = toTxn;
    toTxn.reatt_redes = reattributed;
    toTxn.children[0] = fromTxn;

    const result = ReattRedesUtils.getPayloads(payload);

    expect(result[0].reattribution_redesignation_tag).toBe(ReattRedesTypes.REATTRIBUTED);
    expect(result[1].reattribution_redesignation_tag).toBe(ReattRedesTypes.REATTRIBUTION_TO);
    expect(result[2].reattribution_redesignation_tag).toBe(ReattRedesTypes.REATTRIBUTION_FROM);
  });
});
