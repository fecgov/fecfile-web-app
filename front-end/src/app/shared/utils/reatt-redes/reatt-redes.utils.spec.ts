import { SchATransaction } from '../../models/scha-transaction.model';
import { FormControl, FormGroup } from '@angular/forms';
import { ReattRedesTypes, ReattRedesUtils } from './reatt-redes.utils';
import { getTestIndividualReceipt, testScheduleATransaction } from '../unit-test.utils';

describe('ReattRedesUtils', () => {
  describe('isReattRedes', () => {
    it('should test if transaction is reatt/redes', () => {
      const txn = getTestIndividualReceipt();
      let result = ReattRedesUtils.isReattRedes(txn, [ReattRedesTypes.REATTRIBUTED]);
      expect(result).toBeFalse();
      txn.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTED;
      result = ReattRedesUtils.isReattRedes(txn, [ReattRedesTypes.REATTRIBUTED]);
      expect(result).toBeTrue();
    });

    it('should skip types check if no types provided', () => {
      const txn = getTestIndividualReceipt();
      txn.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATED;
      let result = ReattRedesUtils.isReattRedes(txn);
      expect(result).toBeTrue();

      result = ReattRedesUtils.isReattRedes(txn, [ReattRedesTypes.REATTRIBUTED]);
      expect(result).toBeFalse();
    });
  });

  describe('isAtAmountLimit', () => {
    it('should test if transaction isAtAmountLimit', () => {
      const txn = getTestIndividualReceipt();
      txn.transaction_id = 'AC9877E1';
      let result = ReattRedesUtils.isAtAmountLimit(txn);
      expect(result).toBeFalse();
      
      txn.reatt_redes_total = 100;
      txn.contribution_amount = 100;
      txn.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTED;
      result = ReattRedesUtils.isAtAmountLimit(txn);
      expect(result).toBeTrue();


      txn.reatt_redes_total = 200;
      txn.contribution_amount = 100;
      expect(() => ReattRedesUtils.isAtAmountLimit(txn)).toThrow(
        new Error('Fecfile: Transaction (AC9877E1) has more reattributions or redesignations that its amount allows.')
      );
    });
  });

  describe('overlayForms', () => {
    const toForm = new FormGroup({
      contribution_purpose_descip: new FormControl(''),
      memo_code: new FormControl(''),
    });
    const fromForm = new FormGroup({
      contribution_purpose_descrip: new FormControl(''),
      memo_code: new FormControl(''),
      contributor_organization_name: new FormControl(''),
      contributor_last_name: new FormControl(''),
      contributor_first_name: new FormControl(''),
    });
    let toTxn: SchATransaction;
    let fromTxn: SchATransaction;

    beforeEach(() => {
      toTxn = getTestIndividualReceipt();
      fromTxn = getTestIndividualReceipt();
    });

    it('should overlay reattribution forms correctly', () => {
      toTxn.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTION_TO;
      fromTxn.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTION_FROM;

      ReattRedesUtils.overlayForms(toForm, toTxn, fromForm, fromTxn);
      expect(toForm.get('memo_code')?.enabled).toBeFalse();
      expect(fromForm.get('contribution_purpose_descrip')?.enabled).toBeFalse();
    });

    it('should overlay redesignation forms correctly', () => {
      toTxn.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATION_TO;
      fromTxn.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATION_FROM;

      ReattRedesUtils.overlayForms(toForm, toTxn, fromForm, fromTxn);
      expect(toForm.get('memo_code')?.enabled).toBeFalse();
      expect(fromForm.get('contribution_purpose_descrip')?.enabled).toBeFalse();
    });
  });

  describe('getPayloads', () => {
    it('should reorder payload correctly', () => {
      const reattributed = getTestIndividualReceipt();
      reattributed.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTED;
      const toTxn = getTestIndividualReceipt();
      toTxn.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTION_TO;
      const fromTxn = getTestIndividualReceipt();
      fromTxn.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTION_FROM;

      const payload = toTxn;
      toTxn.reatt_redes = reattributed;
      toTxn.children[0] = fromTxn;

      const result = ReattRedesUtils.getPayloads(payload);

      expect(result[0].reattribution_redesignation_tag).toBe(ReattRedesTypes.REATTRIBUTED);
      expect(result[1].reattribution_redesignation_tag).toBe(ReattRedesTypes.REATTRIBUTION_TO);
      expect((result[1].children[0] as SchATransaction).reattribution_redesignation_tag).toBe(
        ReattRedesTypes.REATTRIBUTION_FROM
      );
    });
  });

  describe('amountValidator', () => {
    let control: FormControl;
    const txn = {...testScheduleATransaction} as SchATransaction;
    txn.reatt_redes = {...testScheduleATransaction} as SchATransaction;
    (txn.reatt_redes as SchATransaction).reatt_redes_total = 75;
    (txn.reatt_redes as SchATransaction).contribution_amount = 100;

    beforeEach(() => {
      control = new FormControl();
    })

    it('should limit max value to negative when mustBeNegative is true', () => {
      const validatorFunction = ReattRedesUtils.amountValidator(txn, true);
      control.setValue(50);
      let validatorResult = validatorFunction(control);
      expect(validatorResult && validatorResult['exclusiveMax']['exclusiveMax']).toBe(0);

      control.setValue(-10);
      validatorResult = validatorFunction(control);
      expect(validatorResult).toBeNull();

      control.setValue(-500);
      validatorResult = validatorFunction(control);
      expect(validatorResult && validatorResult['max']['max']).toBe(25);
    });

    it('should limit max value to positive when mustBeNegative is false', () => {
      const validatorFunction = ReattRedesUtils.amountValidator(txn);
      control.setValue(25);
      let validatorResult = validatorFunction(control);
      expect(validatorResult).toBeNull();

      control.setValue(-10);
      validatorResult = validatorFunction(control);
      expect(validatorResult && validatorResult['exclusiveMin']['exclusiveMin']).toBe(0);

      control.setValue(50);
      validatorResult = validatorFunction(control);
      expect(validatorResult && validatorResult['max']['max']).toBe(25);
    });
  });

});
