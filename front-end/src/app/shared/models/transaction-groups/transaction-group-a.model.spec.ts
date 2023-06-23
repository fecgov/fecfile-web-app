import { TestBed } from '@angular/core/testing';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionGroupA } from './transaction-group-a.model';

describe('TransactionGroupA', () => {
  let component: TransactionGroupA;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupA],
    });

    component = TestBed.inject(TransactionGroupA);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getFormProperties happy path', () => {
    const testLastNameProperty = 'testLastNameProperty';
    const testTemplateMapCopy = { ...testTemplateMap };
    testTemplateMapCopy.last_name = testLastNameProperty;

    const retval = component.getFormProperties(testTemplateMapCopy);
    expect(retval.includes(testLastNameProperty)).toBeTruthy();
  });

  it('#getContactTypeOptions happy path', () => {
    const expectedRetval = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.INDIVIDUAL]);
    const retval = component.getContactTypeOptions();
    expect(JSON.stringify(expectedRetval) === JSON.stringify(retval)).toBeTruthy();
  });

  it('#hasEmployerInput happy path', () => {
    const testEntityType = ContactTypes.INDIVIDUAL;
    const testScheduleId = 'A';
    const retval = component.hasEmployerInput(testEntityType, testScheduleId);
    expect(retval).toBeTrue();
  });

  it('#hasCommitteeFecIdInput happy path', () => {
    expect(component.hasCommitteeFecIdInput()).toBeFalse();
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
});
