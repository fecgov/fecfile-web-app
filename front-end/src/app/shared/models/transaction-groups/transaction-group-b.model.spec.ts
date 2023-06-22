import { TestBed } from '@angular/core/testing';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionGroupB } from './transaction-group-b.model';

describe('TransactionGroupB', () => {
  let component: TransactionGroupB;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupB],
    });

    component = TestBed.inject(TransactionGroupB);
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
    const expectedRetval = LabelUtils.getPrimeOptions(ContactTypeLabels, [
      ContactTypes.INDIVIDUAL,
      ContactTypes.ORGANIZATION,
      ContactTypes.COMMITTEE,
    ]);
    const retval = component.getContactTypeOptions();
    expect(JSON.stringify(expectedRetval) === JSON.stringify(retval)).toBeTruthy();
  });

  it('#hasEmployerInput happy path', () => {
    const retval = component.hasEmployerInput();
    expect(retval).toBeFalse();
  });

  it('#hasCommitteeFecIdInput happy path', () => {
    const retval = component.hasCommitteeFecIdInput();
    expect(retval).toBeFalse();
  });

  it('#hasElectionInformationInput happy path', () => {
    const retval = component.hasElectionInformationInput();
    expect(retval).toBeFalse();
  });

  it('#hasCandidateInformationInput happy path', () => {
    const retval = component.hasCandidateInformationInput();
    expect(retval).toBeFalse();
  });

  it('#hasCandidateCommitteeInput happy path', () => {
    const retval = component.hasCandidateCommitteeInput();
    expect(retval).toBeFalse();
  });
});
