import { TestBed } from '@angular/core/testing';
import { getFormTypes } from './form-type.utils';
import { FormType } from './form-type.utils';
import { ReportTypes } from '../models';

describe('FormTypeUtils', () => {
  describe('FormType', () => {
    it('should carry properties', () => {
      const f1FormType = new FormType('F1', 'Form 1', 'Statement of organization', '/');
      expect(f1FormType.label).toBe('Form 1');
      expect(f1FormType.createRoute).toEqual('/');
    });
  });

  describe('getFormTypes', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
    });

    it('should have F3X', async () => {
      const F3X = getFormTypes(false).get(ReportTypes.F3X);
      expect(F3X).toBeTruthy();
      expect(F3X?.description).toEqual('Report of Receipts and Disbursements');
      expect(F3X?.code).toEqual('F3X');
    });

    it('should have F3 if environment has showForm3', async () => {
      const F3 = getFormTypes(true).get(ReportTypes.F3);
      expect(F3).toBeTruthy();
      expect(F3?.description).toEqual('Report of Receipts and Disbursements for an Authorized Committee');
      expect(F3?.code).toEqual('F3');
    });

    it('should not have F3 if environment does not have showForm3', async () => {
      const F3 = getFormTypes(false).get(ReportTypes.F3);
      expect(F3).toBeFalsy();
    });
  });
});
