import { TestBed } from '@angular/core/testing';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionTemplateMapType } from '../transaction-type.model';
import { TransactionGroupD } from './transaction-group-d';

describe('TransactionGroupD', () => {
  let component: TransactionGroupD;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupD,],
    });

    component = TestBed.inject(TransactionGroupD);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getFormProperties scha', () => {
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
    const retval = component.getFormProperties(
      testTemplateMap);
    expect(retval.includes(testOrganizationName)).toBeTruthy();
  });

  it('#getContactTypeOptions happy path', () => {
    const expectedRetval = LabelUtils.getPrimeOptions(ContactTypeLabels, [
      ContactTypes.ORGANIZATION,
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
