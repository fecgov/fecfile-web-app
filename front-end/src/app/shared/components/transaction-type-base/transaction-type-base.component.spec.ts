import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { Contact, ContactTypes } from 'app/shared/models/contact.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Message, MessageService, SelectItem } from 'primeng/api';
import { of } from 'rxjs';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';

class TestTransactionTypeBaseComponent extends TransactionTypeBaseComponent {
  formProperties: string[] = [
    'entity_type',
    'contributor_organization_name',
    'contributor_last_name',
    'contributor_first_name',
    'contributor_middle_name',
    'contributor_prefix',
    'contributor_suffix',
    'contributor_street_1',
    'contributor_street_2',
    'contributor_city',
    'contributor_state',
    'contributor_zip',
    'contributor_employer',
    'contributor_occupation',
    'contribution_date',
    'contribution_amount',
    'contribution_aggregate',
    'contribution_purpose_descrip',
    'memo_code',
    'memo_text_description',
  ];
}

const testTransaction = {
  id: '123',
  report_id: '999',
  form_type: undefined,
  filer_committee_id_number: undefined,
  transaction_id: null,
  transaction_type_identifier: 'test',
  contribution_purpose_descrip: undefined,
  parent_transaction_id: undefined,
};

describe('TransactionTypeBaseComponent', () => {
  let component: TestTransactionTypeBaseComponent;
  let fixture: ComponentFixture<TestTransactionTypeBaseComponent>;
  let testMessageService: MessageService;
  let testRouter: Router;
  let testTransactionService: TransactionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestTransactionTypeBaseComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [MessageService, FormBuilder, ValidateService, TransactionService, provideMockStore(testMockStore)],
    }).compileComponents();

    testMessageService = TestBed.inject(MessageService);
    testRouter = TestBed.inject(Router);
    testTransactionService = TestBed.inject(TransactionService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTransactionTypeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#save should navigate for create', () => {
    const testTransaction1: Transaction = {
      id: undefined,
      report_id: undefined,
      form_type: undefined,
      filer_committee_id_number: undefined,
      transaction_id: null,
      transaction_type_identifier: undefined,
      contribution_purpose_descrip: undefined,
      parent_transaction_id: undefined,
    };
    spyOn(testTransactionService, 'create').and.returnValue(of(testTransaction1));
    const componentNavigateToSpy = spyOn(component, 'navigateTo');
    component.transaction = {
      id: undefined,
      report_id: undefined,
      form_type: undefined,
      filer_committee_id_number: undefined,
      transaction_id: null,
      transaction_type_identifier: 'test',
      contribution_purpose_descrip: undefined,
      parent_transaction_id: undefined,
    };

    component.save('list');
    expect(componentNavigateToSpy).toHaveBeenCalledTimes(1);
  });

  it('#save should navigate for update', () => {
    const testTransaction2: Transaction = {
      id: '123',
      report_id: undefined,
      form_type: undefined,
      filer_committee_id_number: undefined,
      transaction_id: null,
      transaction_type_identifier: undefined,
      contribution_purpose_descrip: undefined,
      parent_transaction_id: undefined,
    };
    spyOn(testTransactionService, 'update').and.returnValue(of(testTransaction2));
    const componentNavigateToSpy = spyOn(component, 'navigateTo');
    component.transaction = {
      id: '123',
      report_id: undefined,
      form_type: undefined,
      filer_committee_id_number: undefined,
      transaction_id: null,
      transaction_type_identifier: 'test',
      contribution_purpose_descrip: undefined,
      parent_transaction_id: undefined,
    };

    component.save('list');
    expect(componentNavigateToSpy).toHaveBeenCalledTimes(1);
  });

  it("#navigateTo 'add another' should show popup", () => {
    const expectedMessage: Message = {
      severity: 'success',
      summary: 'Successful',
      detail: 'Transaction Saved',
      life: 3000,
    };
    const messageServiceAddSpy = spyOn(testMessageService, 'add');
    component.navigateTo('add another');
    expect(messageServiceAddSpy).toHaveBeenCalledOnceWith(expectedMessage);
  });

  it("#navigateTo 'add-sub-tran' should show popup + navigate", () => {
    const testTransactionId = '1';
    const testTransactionTypeToAdd = 'testTransactionTypeToAdd';

    component.transaction = testTransaction;

    const expectedMessage: Message = {
      severity: 'success',
      summary: 'Successful',
      detail: 'Parent Transaction Saved',
      life: 3000,
    };
    const expectedRoute = `/transactions/report/999/list/edit/${testTransactionId}/create-sub-transaction/${testTransactionTypeToAdd}`;

    const messageServiceAddSpy = spyOn(testMessageService, 'add');
    const routerNavigateByUrlSpy = spyOn(testRouter, 'navigateByUrl');

    component.navigateTo('add-sub-tran', testTransactionId, testTransactionTypeToAdd);
    expect(messageServiceAddSpy).toHaveBeenCalledOnceWith(expectedMessage);
    expect(routerNavigateByUrlSpy).toHaveBeenCalledOnceWith(expectedRoute);
  });

  it("#navigateTo 'list' should navigate", () => {
    const testTransaction3: Transaction = {
      id: '123',
      report_id: '99',
      form_type: undefined,
      filer_committee_id_number: undefined,
      transaction_id: null,
      transaction_type_identifier: undefined,
      contribution_purpose_descrip: undefined,
      parent_transaction_id: undefined,
    };
    component.transaction = testTransaction3;
    const expectedRoute = `/transactions/report/${testTransaction3.report_id}/list`;
    const routerNavigateByUrlSpy = spyOn(testRouter, 'navigateByUrl');
    component.navigateTo('list');
    expect(routerNavigateByUrlSpy).toHaveBeenCalledOnceWith(expectedRoute);
  });

  it("#navigateTo 'add-sub-tran' should navigate", () => {
    component.transaction = testTransaction;
    const expectedRoute = '/transactions/report/999/list/edit/123/create-sub-transaction/INDV_REC';
    const routerNavigateByUrlSpy = spyOn(testRouter, 'navigateByUrl');
    component.navigateTo('add-sub-tran', '123', 'INDV_REC');
    expect(routerNavigateByUrlSpy).toHaveBeenCalledOnceWith(expectedRoute);
  });

  it("#navigateTo 'to-parent' should navigate", () => {
    component.transaction = { ...testTransaction };
    component.transaction.parent_transaction_id = '333';
    const expectedRoute = '/transactions/report/999/list/edit/333';
    const routerNavigateByUrlSpy = spyOn(testRouter, 'navigateByUrl');
    component.navigateTo('to-parent');
    expect(routerNavigateByUrlSpy).toHaveBeenCalledOnceWith(expectedRoute);
  });

  it('#navigateTo default should navigate', () => {
    component.transaction = testTransaction;
    const expectedRoute = '/transactions/report/999/list';
    const routerNavigateByUrlSpy = spyOn(testRouter, 'navigateByUrl');
    component.navigateTo('list');
    expect(routerNavigateByUrlSpy).toHaveBeenCalledOnceWith(expectedRoute);
  });

  it('#onContactLookupSelect should handle null form', () => {
    const testContact = new Contact();
    testContact.id = '123';
    const testContactSelectItem: SelectItem<Contact> = {
      value: testContact,
    };
    component.form.setControl('entity_type', null);
    component.onContactLookupSelect(testContactSelectItem);
    expect(component.form.get('contributor_last_name')?.value).toBeFalsy();

    component.form.setControl('entity_type', new FormControl(ContactTypes.INDIVIDUAL));
    component.form.setControl('contributor_last_name', null);
    component.form.setControl('contributor_first_name', null);
    component.form.setControl('contributor_middle_name', null);
    component.form.setControl('contributor_prefix', null);
    component.form.setControl('contributor_suffix', null);
    component.form.setControl('contributor_employer', null);
    component.form.setControl('contributor_occupation', null);
    component.form.setControl('contributor_street_1', null);
    component.form.setControl('contributor_street_2', null);
    component.form.setControl('contributor_city', null);
    component.form.setControl('contributor_state', null);
    component.form.setControl('contributor_zip', null);

    component.onContactLookupSelect(testContactSelectItem);
    expect(component.form.get('contributor_last_name')?.value).toBeFalsy();
  });

  it('#onContactLookupSelect should set contact fields', () => {
    const testEntityType = ContactTypes.INDIVIDUAL;
    const testLastName = 'testLastName';
    const testFirstName = 'testFirstName';
    const testMiddleName = 'testMiddleName';
    const testPrefix = 'testPrefix';
    const testSuffix = 'testSuffix';
    const testEmployer = 'testEmployer';
    const testOccupation = 'testOccupation';
    const testStreet1 = 'testStreet1';
    const testStreet2 = 'testStreet2';
    const testCity = 'testCity';
    const testState = 'testState';
    const testZip = 'testZip';

    const testContact = new Contact();
    testContact.id = '123';
    testContact.last_name = testLastName;
    testContact.first_name = testFirstName;
    testContact.middle_name = testMiddleName;
    testContact.prefix = testPrefix;
    testContact.suffix = testSuffix;
    testContact.employer = testEmployer;
    testContact.occupation = testOccupation;
    testContact.street_1 = testStreet1;
    testContact.street_2 = testStreet2;
    testContact.city = testCity;
    testContact.state = testState;
    testContact.zip = testZip;

    const testContactSelectItem: SelectItem<Contact> = {
      value: testContact,
    };

    component.form.addControl('entity_type', { value: testEntityType });
    component.onContactLookupSelect(testContactSelectItem);
    const lastNameFormControlValue = component.form.get('contributor_last_name')?.value;
    const firstNameFormControlValue = component.form.get('contributor_first_name')?.value;
    const middleNameFormControlValue = component.form.get('contributor_middle_name')?.value;
    const prefixFormControlValue = component.form.get('contributor_prefix')?.value;
    const suffixFormControlValue = component.form.get('contributor_suffix')?.value;
    const employerFormControlValue = component.form.get('contributor_employer')?.value;
    const occupationFormControlValue = component.form.get('contributor_occupation')?.value;
    const street1FormControlValue = component.form.get('contributor_street_1')?.value;
    const street2FormControlValue = component.form.get('contributor_street_2')?.value;
    const cityFormControlValue = component.form.get('contributor_city')?.value;
    const stateFormControlValue = component.form.get('contributor_state')?.value;
    const zipFormControlValue = component.form.get('contributor_zip')?.value;

    expect(lastNameFormControlValue === testLastName).toBeTrue();
    expect(firstNameFormControlValue === testFirstName).toBeTrue();
    expect(middleNameFormControlValue === testMiddleName).toBeTrue();
    expect(prefixFormControlValue === testPrefix).toBeTrue();
    expect(suffixFormControlValue === testSuffix).toBeTrue();
    expect(employerFormControlValue === testEmployer).toBeTrue();
    expect(occupationFormControlValue === testOccupation).toBeTrue();
    expect(street1FormControlValue === testStreet1).toBeTrue();
    expect(street2FormControlValue === testStreet2).toBeTrue();
    expect(cityFormControlValue === testCity).toBeTrue();
    expect(stateFormControlValue === testState).toBeTrue();
    expect(zipFormControlValue === testZip).toBeTrue();
  });
});
