import { TestBed } from '@angular/core/testing';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionTemplateMapType } from '../transaction-type.model';
import { TransactionGroupA } from './transaction-group-a';

describe('TransactionGroupA', () => {
  let component: TransactionGroupA;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupA,],
    });

    component = TestBed.inject(TransactionGroupA);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getFormProperties scha', () => {
    const testLastNameProperty = 'testLastNameProperty';
    const testScheduleId = 'A';
    const testTemplateMap: TransactionTemplateMapType = {
      last_name: testLastNameProperty,
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
      category_code: '',
      election_code: '',
      election_other_description: ''
    }
    const retval = component.getFormProperties(
      testTemplateMap, testScheduleId);
    expect(retval.includes(testLastNameProperty)).toBeTruthy();
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
    ]);
    const retval = component.getContactTypeOptions();
    expect(JSON.stringify(expectedRetval) ===
      JSON.stringify(retval)).toBeTruthy();
  });

  it('#hasEmployerInput happy path', () => {
    const testEntityType = ContactTypes.INDIVIDUAL;
    const testScheduleId = 'A';
    const retval = component.hasEmployerInput(
      testEntityType, testScheduleId);
    expect(retval).toBeTrue();
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
