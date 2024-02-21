import { FormType, FormTypes, FORM_TYPES } from './form-type.utils';

describe('FormTypeUtils', () => {
  describe('FormType', () => {
    it('should carry properties', () => {
      const f1FormType = new FormType('F1', 'Form 1', 'Statement of organization', '/');
      expect(f1FormType.label).toBe('Form 1');
      expect(f1FormType.createRoute).toEqual('/');
    });
  });

  describe('FORM_TYPES', () => {
    it('should have F3X', () => {
      const F3X = FORM_TYPES.get(FormTypes.F3X);
      expect(F3X).toBeTruthy();
      expect(F3X?.description).toEqual('Report of Receipts and Disbursements');
      expect(F3X?.code).toEqual('F3X');
    });
  });
});
