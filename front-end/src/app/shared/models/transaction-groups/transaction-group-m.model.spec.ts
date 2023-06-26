import { TestBed } from '@angular/core/testing';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionGroupM } from './transaction-group-m.model';

describe('TransactionGroupM', () => {
  let component: TransactionGroupM;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupM],
    });

    component = TestBed.inject(TransactionGroupM);
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
    expect(component.hasElectionInformationInput()).toBeTrue();
  });

  it('#hasCandidateInformationInput happy path', () => {
    expect(component.hasCandidateInformationInput()).toBeTrue();
  });

  it('#hasCandidateCommitteeInput happy path', () => {
    expect(component.hasCandidateCommitteeInput()).toBeTrue();
  });
});
