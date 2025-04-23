import { SchATransaction } from '../../models/scha-transaction.model';
import { FormGroup } from '@angular/forms';
import { ReattRedesTypes, ReattRedesUtils } from './reatt-redes.utils';
import { getTestIndividualReceipt, testScheduleATransaction, testScheduleBTransaction } from '../unit-test.utils';
import { RedesignatedUtils } from './redesignated.utils';
import _ from 'lodash';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { MemoText } from '../../models/memo-text.model';
import { buildReattRedesTransactionValidator } from 'app/shared/utils/validators.utils';
import { SignalFormControl } from '../signal-form-control';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

let injector: Injector;
describe('ReattRedesUtils', () => {
  beforeEach(() => {
    injector = TestBed.inject(Injector);
  });

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
    });
  });

  describe('overlayForms', () => {
    const toForm = new FormGroup(
      {
        contribution_purpose_descip: new SignalFormControl(injector, ''),
        memo_code: new SignalFormControl(injector, ''),
      },
      { updateOn: 'blur' },
    );
    const fromForm = new FormGroup(
      {
        contribution_purpose_descrip: new SignalFormControl(injector, ''),
        memo_code: new SignalFormControl(injector, ''),
        contributor_organization_name: new SignalFormControl(injector, ''),
        contributor_last_name: new SignalFormControl(injector, ''),
        contributor_first_name: new SignalFormControl(injector, ''),
      },
      { updateOn: 'blur' },
    );
    let toTxn: SchATransaction;
    let fromTxn: SchATransaction;

    beforeEach(() => {
      toTxn = getTestIndividualReceipt();
      fromTxn = getTestIndividualReceipt();
    });

    // it('should overlay reattribution forms correctly', () => {
    //   toTxn.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTION_TO;
    //   fromTxn.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTION_FROM;

    //   ReattRedesUtils.overlayForms(toForm, toTxn, fromForm, fromTxn);
    //   expect(toForm.get('memo_code')?.enabled).toBeFalse();
    //   expect(fromForm.get('contribution_purpose_descrip')?.enabled).toBeFalse();
    // });

    // it('should overlay redesignation forms correctly', () => {
    //   toTxn.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATION_TO;
    //   fromTxn.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATION_FROM;

    //   ReattRedesUtils.overlayForms(toForm, toTxn, fromForm, fromTxn);
    //   expect(toForm.get('memo_code')?.enabled).toBeFalse();
    //   expect(fromForm.get('contribution_purpose_descrip')?.enabled).toBeFalse();
    // });
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

      const result = ReattRedesUtils.getPayloads(payload, false);

      expect(result[0].reattribution_redesignation_tag).toBe(ReattRedesTypes.REATTRIBUTED);
      expect(result[1].reattribution_redesignation_tag).toBe(ReattRedesTypes.REATTRIBUTION_TO);
      expect((result[1].children[0] as SchATransaction).reattribution_redesignation_tag).toBe(
        ReattRedesTypes.REATTRIBUTION_FROM,
      );
    });
  });

  describe('amountValidator', () => {
    let control: SignalFormControl;
    const txn = { ...testScheduleATransaction } as SchATransaction;
    txn.reatt_redes = { ...testScheduleATransaction } as SchATransaction;
    (txn.reatt_redes as SchATransaction).reatt_redes_total = 75;
    (txn.reatt_redes as SchATransaction).contribution_amount = 100;

    beforeEach(() => {
      control = new SignalFormControl(injector);
    });

    it('should limit max value to negative when mustBeNegative is true', () => {
      const validatorFunction = buildReattRedesTransactionValidator(txn, true);
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
      const validatorFunction = buildReattRedesTransactionValidator(txn);
      control.setValue(25);
      let validatorResult = validatorFunction(control);
      expect(validatorResult).toBeNull();

      control.setValue(-10);
      validatorResult = validatorFunction(control);
      expect(validatorResult?.['exclusiveMin']['exclusiveMin']).toBe(0);

      control.setValue(50);
      validatorResult = validatorFunction(control);
      expect(validatorResult?.['max']['max']).toBe(25);
    });
  });

  describe('getPayload', () => {
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

    it('should throw error when originating missing transaction type', () => {
      if (!payload.reatt_redes) throw new Error('Bad test setup');
      payload.reatt_redes.transaction_type_identifier = undefined;
      expect(function () {
        ReattRedesUtils.getPayloads(payload, true);
      }).toThrow(Error('Fecfile online: originating transaction type not found.'));
    });

    it('should clone ', () => {
      const cloneSpy = spyOn(_, 'cloneDeep').and.callThrough();
      if (!payload.reatt_redes) throw new Error('Bad test setup');
      payload.reatt_redes.memo_text_id = 'TEST';
      const memo = new MemoText();
      memo.report_id = 'ORIGINAL';
      memo.text_prefix = 'PREFIX';
      memo.text4000 = 'MEMO TEXT';
      memo.rec_type = 'TEXT';
      memo.transaction_id_number = payload.reatt_redes.id;
      memo.transaction_uuid = 'UUID';
      payload.reatt_redes.memo_text = memo;
      payload.reatt_redes = RedesignatedUtils.overlayTransactionProperties(payload.reatt_redes as SchBTransaction);
      const cloned = ReattRedesUtils.getPayloads(payload, true);
      expect(cloneSpy).toHaveBeenCalled();
      expect(cloned[0].report_ids).toEqual(payload.report_ids);
      expect(cloned[0].reports).toBeFalsy();
      expect(cloned[0].id).toBeFalsy();
      expect(cloned[0].reattribution_redesignation_tag).toBe(ReattRedesTypes.REDESIGNATED);
      expect(cloned[0].force_unaggregated).toBeTrue();

      // Test memo text
      expect(cloned[0].memo_text_id).toBeFalsy();
      expect(cloned[0].memo_text).toBeTruthy();
      if (cloned[0].memo_text) {
        expect(cloned[0].memo_text.id).toBeFalsy();
        expect(cloned[0].memo_text?.transaction_uuid).toBeFalsy();
        expect(cloned[0].memo_text?.transaction_id_number).toBeFalsy();
        expect(cloned[0].memo_text?.report_id).toBe(payload.report_ids?.[0]);
      }
    });
  });
});
