import { TestBed } from '@angular/core/testing';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { ContactTypeLabels, ContactTypes } from '../contact.model';
import { TransactionGroupAA } from './transaction-group-aa.model';

describe('TransactionGroupAA', () => {
  let component: TransactionGroupAA;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupAA],
    });

    component = TestBed.inject(TransactionGroupAA);
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

  it('#getChildFormProperties should include last name', () => {
    const testLastName = 'testLastName';
    const testTemplateMapCopy = { ...testTemplateMap };
    testTemplateMapCopy.last_name = testLastName;
    const retval = component.getChildFormProperties(testTemplateMapCopy);
    expect(retval.includes(testLastName)).toBeTruthy();
  });

  it('#getContactTypeOptions should return individual', () => {
    const expectedRetval = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.INDIVIDUAL]);
    const retval = component.getContactTypeOptions();
    expect(JSON.stringify(expectedRetval) === JSON.stringify(retval)).toBeTruthy();
  });

  it('#getChildContactTypeOptions should return individual and committee', () => {
    const expectedOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.INDIVIDUAL]);
    const options = component.getChildContactTypeOptions();
    expect(JSON.stringify(expectedOptions) === JSON.stringify(options)).toBeTruthy();
  });

  it('#hasEmployerInput should return true', () => {
    const retval = component.hasEmployerInput();
    expect(retval).toBeTrue();
  });

  it('#getChildTransactionTitle should return title', () => {
    const retval = component.getChildTransactionTitle();
    expect(retval === 'In-kind Out').toBeTrue();
  });

  it('#test group methods to ensure they return the right values', () => {
    expect(component.childHasEmployerInput()).toBeFalse();
    expect(component.getParentTransactionTitle()).toBe('');
    expect(component.getParentFooter()).toBe(
      'The information in this receipt will automatically populate a related transaction. Review the associated disbursement or click "Save both transactions" to record these transactions.'
    );
    expect(component.getGroupDescription()).toBe(
      'This receipt type automatically creates an associated transaction. Saving an in-kind receipt will automatically create an in-kind out.'
    );
    expect(component.getParentAccordionTitle()).toBe('ENTER DATA');
    expect(component.getParentAccordionSubTitle()).toBe('Add contact and receipt information');
    expect(component.getChildAccordionTitle()).toBe('AUTO-POPULATED');
    expect(component.getChildAccordionSubTitle()).toBe('Review disbursement information');
    expect(component.getChildContactLabel()).toBe('Contact');
    expect(component.getAutoGeneratedChildFields(testTemplateMap).length).toBe(16);
    expect(component.getChildTransactionSubTitle()).toBe(
      'To update any errors found, return to the previous step to update the in-kind receipt.'
    );
  });
});