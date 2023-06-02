import { TestBed } from '@angular/core/testing';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionGroupAA } from './transaction-group-aa.model';

describe('TransactionGroupAA', () => {
  let component: TransactionGroupAA;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupAA],
    });

    component = TestBed.inject(TransactionGroupAA);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getFormProperties should include last name', () => {
    const testLastName = 'testLastName';
    const testTemplateMapCopy = { ...testTemplateMap };
    testTemplateMapCopy.last_name = testLastName;
    const retval = component.getFormProperties(testTemplateMapCopy);
    expect(retval.includes(testLastName)).toBeTruthy();
  });

  it('#getChildFormProperties should include org name', () => {
    const testOrganizationName = 'testOrganizationName';
    const testTemplateMapCopy = { ...testTemplateMap };
    testTemplateMapCopy.organization_name = testOrganizationName;
    const retval = component.getChildFormProperties(testTemplateMapCopy);
    expect(retval.includes(testOrganizationName)).toBeTruthy();
  });

  it('#getContactTypeOptions should return individual', () => {
    const expectedRetval = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.INDIVIDUAL]);
    const retval = component.getContactTypeOptions();
    expect(JSON.stringify(expectedRetval) === JSON.stringify(retval)).toBeTruthy();
  });

  it('#getChildContactTypeOptions should return individual and committee', () => {
    const expectedOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.INDIVIDUAL]);
    const options = component.getChildContactTypeOptions();
    expect(JSON.stringify(expectedOptions) === JSON.stringify(options)).toBeTruthy();
  });

  it('#hasEmployerInput should return true', () => {
    const retval = component.hasEmployerInput();
    expect(retval).toBeTrue();
  });

  it('#getChildTransactionTitle should return title', () => {
    const retval = component.getChildTransactionTitle();
    expect(retval === 'In-Kind out').toBeTrue();
  });
});
