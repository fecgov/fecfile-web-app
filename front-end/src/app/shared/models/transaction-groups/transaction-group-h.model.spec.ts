import { TestBed } from '@angular/core/testing';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionGroupH } from './transaction-group-h.model';

describe('TransactionGroupH', () => {
  let component: TransactionGroupH;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupH],
    });

    component = TestBed.inject(TransactionGroupH);
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

  it('#getContactTypeOptions happy path', () => {
    const expectedRetval = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);
    const retval = component.getContactTypeOptions();
    expect(JSON.stringify(expectedRetval) === JSON.stringify(retval)).toBeTruthy();
  });

  it('#hasEmployerInput happy path', () => {
    const retval = component.hasEmployerInput();
    expect(retval).toBeFalse();
  });

  it('#hasCommitteeFecIdInput happy path', () => {
    const retval = component.hasCommitteeFecIdInput();
    expect(retval).toBeTrue();
  });

  it('#hasElectionInformationInput happy path', () => {
    const retval = component.hasElectionInformationInput();
    expect(retval).toBeTrue();
  });

  it('#hasCandidateInformationInput happy path', () => {
    const retval = component.hasCandidateInformationInput();
    expect(retval).toBeTrue();
  });
});
