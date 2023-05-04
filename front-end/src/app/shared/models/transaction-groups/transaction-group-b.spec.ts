import { TestBed } from '@angular/core/testing';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionTemplateMapType } from '../transaction-type.model';
import { TransactionGroupB } from './transaction-group-b';

describe('TransactionGroupB', () => {
  let component: TransactionGroupB;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupB,],
    });

    component = TestBed.inject(TransactionGroupB);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getFormProperties scha', () => {
    const testOrganizationName = 'testOrganizationName';
    const testScheduleId = 'A';
    const testTemplateMap: TransactionTemplateMapType = {
      last_name: '',
      first_name: '',
      middle_name: '',
      prefix: '',
      suffix: '',
      street_1: '',
      street_2: '',
      city: '',
      state: '',
      zip: '',
      employer: '',
      occupation: '',
      organization_name: testOrganizationName,
      committee_fec_id: '',
      committee_name: '',
      date: '',
      dateLabel: '',
      memo_code: '',
      amount: '',
      aggregate: '',
      purpose_description: '',
      purposeDescripLabel: '',
      memo_text_input: '',
      category_code: '',
      election_code: '',
      election_other_description: ''
    }
    const retval = component.getFormProperties(
      testTemplateMap, testScheduleId);
    expect(retval.includes(testOrganizationName)).toBeTruthy();
  });

  it('#getFormProperties schb', () => {
    const testCategoryCode = 'testCategoryCode';
    const testScheduleId = 'B';
    const testTemplateMap: TransactionTemplateMapType = {
      last_name: '',
      first_name: '',
      middle_name: '',
      prefix: '',
      suffix: '',
      street_1: '',
      street_2: '',
      city: '',
      state: '',
      zip: '',
      employer: '',
      occupation: '',
      organization_name: '',
      committee_fec_id: '',
      committee_name: '',
      date: '',
      dateLabel: '',
      memo_code: '',
      amount: '',
      aggregate: '',
      purpose_description: '',
      purposeDescripLabel: '',
      memo_text_input: '',
      category_code: testCategoryCode,
      election_code: '',
      election_other_description: ''
    }
    const retval = component.getFormProperties(
      testTemplateMap, testScheduleId);
    expect(retval.includes(testCategoryCode)).toBeTruthy();
  });

  it('#getContactTypeOptions happy path', () => {
    const expectedRetval = LabelUtils.getPrimeOptions(ContactTypeLabels, [
      ContactTypes.INDIVIDUAL,
      ContactTypes.ORGANIZATION,
      ContactTypes.COMMITTEE,
    ]);
    const retval = component.getContactTypeOptions();
    expect(JSON.stringify(expectedRetval) ===
      JSON.stringify(retval)).toBeTruthy();
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

  it('#getAmountInputTitle happy path', () => {
    const retval = component.getAmountInputTitle();
    expect(retval === 'Receipt Information').toBeTrue();
  });

});
