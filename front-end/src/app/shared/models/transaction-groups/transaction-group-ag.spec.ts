import { TestBed } from '@angular/core/testing';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionGroupAG } from './transaction-group-ag';

describe('TransactionGroupAG', () => {
  let component: TransactionGroupAG;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupAG,],
    });

    component = TestBed.inject(TransactionGroupAG);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getFormProperties happy path', () => {
    const testLastName = 'testLastName';
    const testTemplateMapCopy = { ...testTemplateMap };
    testTemplateMapCopy.last_name = testLastName;
    const retval = component.getFormProperties(
      testTemplateMapCopy);
    expect(retval.includes(testLastName)).toBeTruthy();
  });

  it('#getChildFormProperties happy path', () => {
    const testOrganizationName = 'testOrganizationName';
    const testTemplateMapCopy = { ...testTemplateMap };
    testTemplateMapCopy.organization_name = testOrganizationName;
    const retval = component.getChildFormProperties(
      testTemplateMapCopy);
    expect(retval.includes(testOrganizationName)).toBeTruthy();
  });

  it('#getContactTypeOptions happy path', () => {
    const expectedRetval = LabelUtils.getPrimeOptions(ContactTypeLabels, [
      ContactTypes.INDIVIDUAL,
    ]);
    const retval = component.getContactTypeOptions();
    expect(JSON.stringify(expectedRetval) ===
      JSON.stringify(retval)).toBeTruthy();
  });

  it('#getChildContactTypeOptions happy path', () => {
    const expectedRetval = LabelUtils.getPrimeOptions(ContactTypeLabels, [
      ContactTypes.INDIVIDUAL,
      ContactTypes.COMMITTEE,
    ]);
    const retval = component.getChildContactTypeOptions();
    expect(JSON.stringify(expectedRetval) ===
      JSON.stringify(retval)).toBeTruthy();
  });

  it('#hasEmployerInput happy path', () => {
    const retval = component.hasEmployerInput();
    expect(retval).toBeTrue();
  });

  it('#getChildTransactionTitle happy path', () => {
    const retval = component.getChildTransactionTitle();
    expect(retval === 'Earmark memo').toBeTrue();
  });

});
