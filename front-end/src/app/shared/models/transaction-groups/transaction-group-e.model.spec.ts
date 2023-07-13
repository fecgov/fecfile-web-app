import { TestBed } from '@angular/core/testing';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionGroupE } from './transaction-group-e.model';

describe('TransactionGroupE', () => {
  let component: TransactionGroupE;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupE],
    });

    component = TestBed.inject(TransactionGroupE);
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
    expect(component.hasEmployerInput()).toBeFalse();
  });

  it('#hasCommitteeFecIdInput happy path', () => {
    expect(component.hasCommitteeFecIdInput()).toBeTrue();
  });

  it('#hasElectionInformationInput happy path', () => {
    expect(component.hasElectionInformationInput()).toBeFalse();
  });

  it('#hasCandidateInformationInput happy path', () => {
    expect(component.hasCandidateInformationInput()).toBeFalse();
  });

  it('#hasCandidateCommitteeInput happy path', () => {
    expect(component.hasCandidateCommitteeInput()).toBeFalse();
  });

  it('#hasCandidateOfficeInput happy path', () => {
    expect(component.hasCandidateOfficeInput()).toBeTrue();
  });
});
