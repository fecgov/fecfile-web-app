import { TestBed } from '@angular/core/testing';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionTemplateMapType } from '../transaction-type.model';
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
    const testTemplateMap: TransactionTemplateMapType = {
      last_name: testLastName,
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
      testTemplateMap);
    expect(retval.includes(testLastName)).toBeTruthy();
  });

  it('#getChildFormProperties happy path', () => {
    const testOrganizationName = 'testOrganizationName';
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
    const retval = component.getChildFormProperties(
      testTemplateMap);
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
