import { TestBed } from '@angular/core/testing';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionGroupYB } from './transaction-group-yb.model';

describe('TransactionGroupYB', () => {
  let component: TransactionGroupYB;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupYB],
    });

    component = TestBed.inject(TransactionGroupYB);
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
    const testOrgName = 'testOrgName';
    const testTemplateMapCopy = { ...testTemplateMap };
    testTemplateMapCopy.organization_name = testOrgName;
    const retval = component.getChildFormProperties(testTemplateMapCopy);
    expect(retval.includes(testOrgName)).toBeTruthy();
  });

  it('#getContactTypeOptions should return individual', () => {
    const expectedRetval = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);
    const retval = component.getContactTypeOptions();
    expect(JSON.stringify(expectedRetval) === JSON.stringify(retval)).toBeTruthy();
  });

  it('#getChildContactTypeOptions should return individual and committee', () => {
    const expectedOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);
    const options = component.getChildContactTypeOptions();
    expect(JSON.stringify(expectedOptions) === JSON.stringify(options)).toBeTruthy();
  });

  it('#hasEmployerInput should return false', () => {
    const retval = component.hasEmployerInput();
    expect(retval).toBeFalse();
  });

  it('#test group methods to ensure they return the right values', () => {
    expect(component.childHasEmployerInput()).toBeFalse();
    expect(component.getParentTransactionTitle()).toBe('');
    expect(component.getParentFooter()).toBe(
      'The information in this loan will automatically populate a related transaction. Review the associated loan and enter a purpose of receipt or note/memo text; or click "Save transactions" to record these transactions.'
    );
    expect(component.getGroupDescription()).toBe(
      'This loan type automatically creates an associated transaction. Saving a loan by committee will automatically create an associated disbursement.'
    );
    expect(component.getParentAccordionTitle()).toBe('ENTER DATA');
    expect(component.getParentAccordionSubTitle()).toBe(
      'Enter lender, loan, and terms information for a loan by committee'
    );
    expect(component.getChildAccordionTitle()).toBe('AUTO-POPULATED');
    expect(component.getChildAccordionSubTitle()).toBe(
      'Review information and enter purpose of description or note/memo text for the loan made'
    );
    expect(component.getChildContactLabel()).toBe('Lendee');
    expect(component.getAutoGeneratedChildFields(testTemplateMap).length).toBe(12);
    expect(component.getChildTransactionSubTitle()).toBe(
      'Only the Purpose of Disbursement and Note/Memo Text are editable. To update any errors found, return to <b>ENTER DATA</b> to update loan information.'
    );
    expect(component.hasChildCandidateInformationInput()).toBeFalse();
    expect(component.hasChildElectionInformationInput()).toBeFalse();
    expect(component.hasParentCandidateInformationInput()).toBeFalse();
    expect(component.hasParentElectionInformationInput()).toBeFalse();
  });
});