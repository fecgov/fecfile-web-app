import { TestBed } from '@angular/core/testing';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionGroupFG } from './transaction-group-fg.model';

describe('TransactionGroupFG', () => {
  let component: TransactionGroupFG;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupFG],
    });

    component = TestBed.inject(TransactionGroupFG);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getFormProperties happy path', () => {
    const testOrganizationName = 'testOrganizationName';
    const testTemplateMapCopy = { ...testTemplateMap };
    testTemplateMapCopy.organization_name = testOrganizationName;
    const retval = component.getFormProperties(testTemplateMapCopy);
    expect(retval.includes(testOrganizationName)).toBeTruthy();
  });

  it('#getChildFormProperties happy path', () => {
    const testEmployer = 'testEmployer';
    const testTemplateMapCopy = { ...testTemplateMap };
    testTemplateMapCopy.employer = testEmployer;
    const retval = component.getChildFormProperties(testTemplateMapCopy);
    expect(retval.includes(testEmployer)).toBeTruthy();
  });

  it('#getContactTypeOptions happy path', () => {
    const expectedRetval = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);
    const retval = component.getContactTypeOptions();
    expect(JSON.stringify(expectedRetval) === JSON.stringify(retval)).toBeTruthy();
  });

  it('#getChildContactTypeOptions happy path', () => {
    const expectedRetval = LabelUtils.getPrimeOptions(ContactTypeLabels, [
      ContactTypes.INDIVIDUAL,
      ContactTypes.COMMITTEE,
    ]);
    const retval = component.getChildContactTypeOptions();
    expect(JSON.stringify(expectedRetval) === JSON.stringify(retval)).toBeTruthy();
  });

  it('#hasEmployerInput happy path', () => {
    const retval = component.hasEmployerInput();
    expect(retval).toBeFalse();
  });

  it('#getChildTransactionTitle happy path', () => {
    const retval = component.getChildTransactionTitle();
    expect(retval === 'PAC Earmark memo').toBeTrue();
  });
});
