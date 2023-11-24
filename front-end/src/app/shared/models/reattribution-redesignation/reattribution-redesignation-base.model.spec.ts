import { ReattributionRedesignationBase } from './reattribution-redesignation-base.model';
import { FormControl } from '@angular/forms';
import { testScheduleATransaction } from 'app/shared/utils/unit-test.utils';

// Must extend the abstract class so we can get an instance.
class Implemented extends ReattributionRedesignationBase {}

describe('ReattributionRedesignationBase', () => {
  let obj: Implemented;

  beforeEach(() => {
    obj = new Implemented();
  });

  it('should create an instance', () => {
    expect(obj).toBeTruthy();
  });

  it('amountValidator() should limit max value', () => {
    testScheduleATransaction.contribution_amount = 100;
    const validatorFunction = obj.amountValidator(testScheduleATransaction, true);

    const control = new FormControl();
    control.setValue(50);
    let validatorResult = validatorFunction(control);
    expect(validatorResult && validatorResult['exclusiveMax']['exclusiveMax']).toBe(0);

    control.setValue(-50);
    validatorResult = validatorFunction(control);
    expect(validatorResult).toBeNull();

    control.setValue(-500);
    validatorResult = validatorFunction(control);
    expect(validatorResult && validatorResult['max']['max']).toBe(100);
  });
});
