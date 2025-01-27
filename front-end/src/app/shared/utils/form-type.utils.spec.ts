import { environment } from 'environments/environment';
import { FormType, FormTypes } from './form-type.utils';

describe('FormTypeUtils', () => {
  describe('FormType', () => {
    it('should carry properties', () => {
      const f1FormType = new FormType('F1', 'Form 1', 'Statement of organization', '/');
      expect(f1FormType.label).toBe('Form 1');
      expect(f1FormType.createRoute).toEqual('/');
    });
  });

  describe('FORM_TYPES', () => {
    let originalEnvironment: any; // eslint-disable-line @typescript-eslint/no-explicit-any

    beforeEach(() => {
      // Save the original environment
      originalEnvironment = { ...environment };
    });

    afterEach(() => {
      // Restore the original environment after each test
      Object.assign(environment, originalEnvironment);
    });

    it('should have F3X', async () => {
      const { FORM_TYPES } = await loadFormTypes();
      const F3X = FORM_TYPES.get(FormTypes.F3X);
      expect(F3X).toBeTruthy();
      expect(F3X?.description).toEqual('Report of Receipts and Disbursements');
      expect(F3X?.code).toEqual('F3X');
    });

    it('should have F3 if environment has showForm3', async () => {
      expect(environment.showForm3).toBeTrue();
      const { FORM_TYPES } = await loadFormTypes();
      const F3 = FORM_TYPES.get(FormTypes.F3);
      expect(F3).toBeTruthy();
      expect(F3?.description).toEqual('Report of Receipts and Disbursements for an Authorized Committee');
      expect(F3?.code).toEqual('F3');
    });

    it('should not have F3 if environment does not have showForm3', async () => {
      environment.showForm3 = false;
      expect(environment.showForm3).toBeFalse();
      const { FORM_TYPES } = await loadFormTypes();
      const F3 = FORM_TYPES.get(FormTypes.F3);
      expect(F3).toBeFalsy();
    });
  });
});

async function loadFormTypes() {
  // Clear the module cache for the test file
  const modulePath = require.resolve('./form-type.utils');
  delete require.cache[modulePath];
  // Re-import the module dynamically
  return import('./form-type.utils');
}
