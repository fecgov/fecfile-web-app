import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';
import { NavigationDestination } from 'app/shared/models/transaction-navigation-controls.model';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { Contact, ContactTypes } from 'app/shared/models/contact.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ApiService } from 'app/shared/services/api.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Confirmation, ConfirmationService, Message, MessageService, SelectItem } from 'primeng/api';
import { of } from 'rxjs';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';
import { TransactionTypeUtils } from '../../utils/transaction-type.utils';
import { ScheduleATransactionTypes } from '../../models/scha-transaction.model';
import { MemoText } from 'app/shared/models/memo-text.model';

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
    'memo_text_input',
  ];
}

const testTransaction = {
  id: '123',
  report_id: '999',
  contact: undefined,
  contact_id: '333',
  form_type: undefined,
  filer_committee_id_number: undefined,
  transaction_id: null,
  transaction_type_identifier: 'test',
  aggregation_group: 'GENERAL',
  contribution_amount: '202.2',
  contribution_date: '2022-02-02',
  contribution_purpose_descrip: undefined,
  parent_transaction_id: undefined,
  children: undefined,
  parent_transaction: undefined,
  fields_to_validate: undefined,
  itemized: false,
  memo_text: undefined,
  memo_text_id: undefined,
};

describe('TransactionTypeBaseComponent', () => {
  let component: TestTransactionTypeBaseComponent;
  let fixture: ComponentFixture<TestTransactionTypeBaseComponent>;
  let testMessageService: MessageService;
  let testRouter: Router;
  let testTransactionService: TransactionService;
  let testApiService: ApiService;
  let testConfirmationService: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestTransactionTypeBaseComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        DatePipe,
        MessageService,
        FormBuilder,
        ValidateService,
        TransactionService,
        ConfirmationService,
        provideMockStore(testMockStore),
        FecDatePipe,
      ],
    }).compileComponents();

    testMessageService = TestBed.inject(MessageService);
    testRouter = TestBed.inject(Router);
    testTransactionService = TestBed.inject(TransactionService);
    testApiService = TestBed.inject(ApiService);
    testConfirmationService = TestBed.inject(ConfirmationService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTransactionTypeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#retrieveMemoText should work', () => {
    if (component.transactionType) component.transactionType.transaction = testTransaction;
    else
      component.transactionType = {
        transaction: testTransaction,
        scheduleId: 'TEST',
        componentGroupId: 'TEST',
        isDependentChild: false,
        title: 'Title goes here',
        contributionPurposeDescripReadonly: () => {
          return '';
        },
        getNewTransaction: () => {
          return testTransaction;
        },
        schema: {
          $id: '10101',
          $schema: 'string',
          type: 'string',
          required: ['string'],
          properties: {},
        },
      };

    component.form = new FormGroup({
      memo_text_input: new FormControl('memo'),
    });
    const formValues = component.retrieveMemoText(component.transactionType, component.form, {});
    expect(formValues['memo_text']['text4000']).toBe('memo');
  });

  it('#save should update IND contact', () => {
    const testTransaction1: Transaction = {
      id: undefined,
      report_id: undefined,
      contact: undefined,
      contact_id: undefined,
      form_type: undefined,
      filer_committee_id_number: undefined,
      transaction_id: null,
      transaction_type_identifier: undefined,
      contribution_purpose_descrip: undefined,
      parent_transaction_id: undefined,
      children: undefined,
      parent_transaction: undefined,
      fields_to_validate: undefined,
      itemized: false,
      memo_text: MemoText.fromJSON({ text4000: 'Memo!' }),
      memo_text_id: 'ID Goes Here',
    };
    const testContact: Contact = new Contact();
    testContact.id = 'testId';
    testContact.type = ContactTypes.INDIVIDUAL;
    testContact.last_name = 'testLn1';
    testContact.first_name = 'testFn1';
    testContact.middle_name = 'testMn1';
    testContact.prefix = 'testPrefix1';
    testContact.suffix = 'testSuffix1';
    testContact.employer = 'testEmployer1';
    testContact.occupation = 'testOccupation1';
    testContact.street_1 = 'testStreet1';
    testContact.street_2 = 'testStreet2';
    testContact.city = 'testCity1';
    testContact.state = 'VA';
    testContact.zip = '12345';

    spyOn(testApiService, 'post').and.returnValue(of(testContact));
    spyOn(testTransactionService, 'create').and.returnValue(of(testTransaction1));
    spyOn(testConfirmationService, 'confirm').and.callFake((confirmation: Confirmation) => {
      if (confirmation.accept) {
        return confirmation.accept();
      }
    });

    const componentNavigateToSpy = spyOn(component, 'navigateTo');
    component.transactionType = {
      transaction: {
        id: undefined,
        report_id: undefined,
        contact: undefined,
        contact_id: undefined,
        form_type: undefined,
        filer_committee_id_number: undefined,
        transaction_id: null,
        transaction_type_identifier: 'test',
        contribution_purpose_descrip: undefined,
        parent_transaction_id: undefined,
        itemized: false,
      },
    } as TransactionType;

    if (component.transactionType.transaction) {
      component.transactionType.transaction.contact = testContact;
    }
    component.save(NavigationDestination.LIST);
    component.form = new FormGroup([]);
    component.save(NavigationDestination.LIST);
    const testContact2 = new Contact();
    testContact2.type = ContactTypes.INDIVIDUAL;
    testContact2.id = 'testId';
    if (component.transactionType.transaction) {
      component.transactionType.transaction.contact = testContact2;
    }
    component.save(NavigationDestination.LIST);
    if (component.transactionType.transaction) {
      component.transactionType.transaction.contact = undefined;
    }
    component.getEditTransactionContactConfirmationMessage([], testContact, component.form);
    expect(componentNavigateToSpy).toHaveBeenCalledTimes(3);
  });

  it('#save should update COM contact', () => {
    const testTransaction1: Transaction = {
      id: undefined,
      report_id: undefined,
      contact: undefined,
      contact_id: undefined,
      form_type: undefined,
      filer_committee_id_number: undefined,
      transaction_id: null,
      transaction_type_identifier: undefined,
      contribution_purpose_descrip: undefined,
      parent_transaction_id: undefined,
      children: undefined,
      parent_transaction: undefined,
      fields_to_validate: undefined,
      itemized: false,
      memo_text: undefined,
      memo_text_id: undefined,
    };
    const testContact: Contact = new Contact();
    testContact.id = 'testId';
    testContact.type = ContactTypes.COMMITTEE;
    testContact.committee_id = 'C12345679';
    testContact.name = 'testName1';

    spyOn(testApiService, 'post').and.returnValue(of(testContact));
    spyOn(testTransactionService, 'create').and.returnValue(of(testTransaction1));
    spyOn(testConfirmationService, 'confirm').and.callFake((confirmation: Confirmation) => {
      if (confirmation.accept) {
        return confirmation.accept();
      }
    });

    const componentNavigateToSpy = spyOn(component, 'navigateTo');
    component.transactionType = {
      transaction: {
        id: undefined,
        report_id: undefined,
        contact_id: undefined,
        form_type: undefined,
        filer_committee_id_number: undefined,
        transaction_id: null,
        transaction_type_identifier: 'test',
        contribution_purpose_descrip: undefined,
        parent_transaction_id: undefined,
        itemized: false,
        memo_text: undefined,
        memo_text_id: undefined,
      },
    } as TransactionType;

    if (component.transactionType.transaction) {
      component.transactionType.transaction.contact = testContact;
    }
    component.save(NavigationDestination.LIST);
    component.form = new FormGroup([]);
    component.form.addControl('donor_committee_fec_id', new FormControl('test'));
    component.save(NavigationDestination.LIST);
    const testContact2 = new Contact();
    testContact2.type = ContactTypes.COMMITTEE;
    testContact2.id = 'testId';
    if (component.transactionType.transaction) {
      component.transactionType.transaction.contact = testContact2;
    }
    component.save(NavigationDestination.LIST);
    expect(componentNavigateToSpy).toHaveBeenCalledTimes(3);
  });

  it('#save should update ORG contact', () => {
    const testTransaction1: Transaction = {
      id: undefined,
      report_id: undefined,
      contact: undefined,
      contact_id: undefined,
      form_type: undefined,
      filer_committee_id_number: undefined,
      transaction_id: null,
      transaction_type_identifier: undefined,
      contribution_purpose_descrip: undefined,
      parent_transaction_id: undefined,
      children: undefined,
      parent_transaction: undefined,
      fields_to_validate: undefined,
      itemized: false,
      memo_text: undefined,
      memo_text_id: undefined,
    };
    const testContact: Contact = new Contact();
    testContact.id = 'testId';
    testContact.type = ContactTypes.ORGANIZATION;
    testContact.name = 'testName1';

    spyOn(testApiService, 'post').and.returnValue(of(testContact));
    spyOn(testTransactionService, 'create').and.returnValue(of(testTransaction1));
    spyOn(testConfirmationService, 'confirm').and.callFake((confirmation: Confirmation) => {
      if (confirmation.accept) {
        return confirmation.accept();
      }
    });

    const componentNavigateToSpy = spyOn(component, 'navigateTo');
    component.transactionType = {
      transaction: {
        id: undefined,
        report_id: undefined,
        contact_id: undefined,
        form_type: undefined,
        filer_committee_id_number: undefined,
        transaction_id: null,
        transaction_type_identifier: 'test',
        contribution_purpose_descrip: undefined,
        parent_transaction_id: undefined,
        itemized: false,
        memo_text: undefined,
        memo_text_id: undefined,
      },
    } as TransactionType;

    if (component.transactionType.transaction) {
      component.transactionType.transaction.contact = testContact;
    }
    component.save(NavigationDestination.LIST);
    component.form = new FormGroup([]);
    component.save(NavigationDestination.LIST);
    const testContact2 = new Contact();
    testContact2.type = ContactTypes.ORGANIZATION;
    testContact2.id = 'testId';
    if (component.transactionType.transaction) {
      component.transactionType.transaction.contact = testContact2;
    }
    component.save(NavigationDestination.LIST);
    expect(componentNavigateToSpy).toHaveBeenCalledTimes(3);
  });

  it('#save no contact changes', () => {
    const testTransaction1: Transaction = {
      id: undefined,
      report_id: undefined,
      contact: undefined,
      contact_id: undefined,
      form_type: undefined,
      filer_committee_id_number: undefined,
      transaction_id: null,
      transaction_type_identifier: undefined,
      contribution_purpose_descrip: undefined,
      parent_transaction_id: undefined,
      children: undefined,
      parent_transaction: undefined,
      fields_to_validate: undefined,
      itemized: false,
      memo_text: undefined,
      memo_text_id: undefined,
    };
    const testContact: Contact = new Contact();
    testContact.id = 'testId';
    testContact.type = ContactTypes.ORGANIZATION;
    testContact.name = 'testName1';

    spyOn(testApiService, 'post').and.returnValue(of(testContact));
    spyOn(testTransactionService, 'create').and.returnValue(of(testTransaction1));
    spyOn(testConfirmationService, 'confirm').and.callFake((confirmation: Confirmation) => {
      if (confirmation.accept) {
        return confirmation.accept();
      }
    });

    const componentNavigateToSpy = spyOn(component, 'navigateTo');
    component.transactionType = {
      transaction: {
        id: undefined,
        report_id: undefined,
        contact_id: undefined,
        form_type: undefined,
        filer_committee_id_number: undefined,
        transaction_id: null,
        transaction_type_identifier: 'test',
        contribution_purpose_descrip: undefined,
        parent_transaction_id: undefined,
        itemized: false,
        memo_text: undefined,
        memo_text_id: undefined,
      },
    } as TransactionType;

    if (component.transactionType.transaction) {
      component.transactionType.transaction.contact = undefined;
    }
    component.save(NavigationDestination.LIST);
    expect(componentNavigateToSpy).toHaveBeenCalledTimes(1);
  });

  it('#save should navigate for create', () => {
    const testTransaction1: Transaction = {
      id: undefined,
      report_id: undefined,
      contact: undefined,
      contact_id: undefined,
      form_type: undefined,
      filer_committee_id_number: undefined,
      transaction_id: null,
      transaction_type_identifier: undefined,
      contribution_purpose_descrip: undefined,
      parent_transaction_id: undefined,
      children: undefined,
      parent_transaction: undefined,
      fields_to_validate: undefined,
      itemized: false,
      memo_text: undefined,
      memo_text_id: undefined,
    };
    const testContact: Contact = new Contact();
    testContact.id = 'testId';
    spyOn(testApiService, 'post').and.returnValue(of(testContact));
    spyOn(testTransactionService, 'create').and.returnValue(of(testTransaction1));
    spyOn(testConfirmationService, 'confirm').and.callFake((confirmation: Confirmation) => {
      if (confirmation.accept) {
        return confirmation.accept();
      }
    });

    const componentNavigateToSpy = spyOn(component, 'navigateTo');
    component.transactionType = {
      transaction: {
        id: undefined,
        report_id: undefined,
        contact: undefined,
        contact_id: undefined,
        form_type: undefined,
        filer_committee_id_number: undefined,
        transaction_id: null,
        transaction_type_identifier: 'test',
        contribution_purpose_descrip: undefined,
        parent_transaction_id: undefined,
        itemized: false,
        memo_text: undefined,
        memo_text_id: undefined,
      },
    } as TransactionType;

    component.save(NavigationDestination.LIST);
    expect(componentNavigateToSpy).toHaveBeenCalledTimes(1);
  });

  it('#save should navigate for update', fakeAsync(() => {
    const testTransaction2: Transaction = {
      id: '123',
      report_id: undefined,
      contact: undefined,
      contact_id: undefined,
      form_type: undefined,
      filer_committee_id_number: undefined,
      transaction_id: null,
      transaction_type_identifier: undefined,
      contribution_purpose_descrip: undefined,
      parent_transaction_id: undefined,
      children: undefined,
      parent_transaction: undefined,
      fields_to_validate: undefined,
      itemized: false,
      memo_text: undefined,
      memo_text_id: undefined,
    };
    const testContact: Contact = new Contact();
    testContact.id = 'testId';
    spyOn(testApiService, 'post').and.returnValue(of(testContact));
    spyOn(testTransactionService, 'update').and.returnValue(of(testTransaction2));
    spyOn(testConfirmationService, 'confirm').and.callFake((confirmation: Confirmation) => {
      if (confirmation.accept) {
        return confirmation.accept();
      }
    });

    const componentNavigateToSpy = spyOn(component, 'navigateTo');
    component.transactionType = {
      transaction: {
        id: '123',
        report_id: undefined,
        contact: undefined,
        contact_id: undefined,
        form_type: undefined,
        filer_committee_id_number: undefined,
        transaction_id: null,
        transaction_type_identifier: 'test',
        contribution_purpose_descrip: undefined,
        parent_transaction_id: undefined,
        itemized: false,
        memo_text: undefined,
        memo_text_id: undefined,
      },
    } as TransactionType;

    component.save(NavigationDestination.LIST);
    tick(1000);
    expect(componentNavigateToSpy).toHaveBeenCalledTimes(1);
  }));

  it('#navigateTo NavigationDestination.ANOTHER should show popup', () => {
    const expectedMessage: Message = {
      severity: 'success',
      summary: 'Successful',
      detail: 'Transaction Saved',
      life: 3000,
    };
    const messageServiceAddSpy = spyOn(testMessageService, 'add');
    component.navigateTo(NavigationDestination.ANOTHER);
    expect(messageServiceAddSpy).toHaveBeenCalledOnceWith(expectedMessage);
  });

  it('#navigateTo NavigationDestination.CHILD should show popup + navigate', () => {
    const testTransactionId = '1';
    const testTransactionTypeToAdd = ScheduleATransactionTypes.INDIVIDUAL_RECEIPT;

    component.transactionType = TransactionTypeUtils.factory(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT);
    if (component.transactionType) {
      component.transactionType.transaction = testTransaction;
      component.transactionType.transaction.report_id = '999';
    }

    const expectedMessage: Message = {
      severity: 'success',
      summary: 'Successful',
      detail: 'Parent Transaction Saved',
      life: 3000,
    };
    const expectedRoute = `/transactions/report/999/list/edit/${testTransactionId}/create-sub-transaction/${testTransactionTypeToAdd}`;

    const messageServiceAddSpy = spyOn(testMessageService, 'add');
    const routerNavigateByUrlSpy = spyOn(testRouter, 'navigateByUrl');

    component.navigateTo(NavigationDestination.CHILD, testTransactionId, testTransactionTypeToAdd);
    expect(messageServiceAddSpy).toHaveBeenCalledOnceWith(expectedMessage);
    expect(routerNavigateByUrlSpy).toHaveBeenCalledOnceWith(expectedRoute);
  });

  it('#navigateTo NavigationDestination.LIST should navigate', () => {
    const testTransaction3: Transaction = {
      id: '123',
      report_id: '99',
      contact: undefined,
      contact_id: '33',
      form_type: undefined,
      filer_committee_id_number: undefined,
      transaction_id: null,
      transaction_type_identifier: undefined,
      contribution_purpose_descrip: undefined,
      parent_transaction_id: undefined,
      children: undefined,
      parent_transaction: undefined,
      fields_to_validate: undefined,
      itemized: false,
      memo_text: undefined,
      memo_text_id: undefined,
    };
    component.transactionType = {
      transaction: testTransaction3,
    } as TransactionType;
    const expectedRoute = `/transactions/report/${testTransaction3.report_id}/list`;
    const routerNavigateByUrlSpy = spyOn(testRouter, 'navigateByUrl');
    component.navigateTo(NavigationDestination.LIST);
    expect(routerNavigateByUrlSpy).toHaveBeenCalledOnceWith(expectedRoute);
  });

  it('#navigateTo NavigationDestination.CHILD should navigate', () => {
    component.transactionType = TransactionTypeUtils.factory('INDIVIDUAL_RECEIPT');
    if (component.transactionType) {
      component.transactionType.transaction = testTransaction;
    }
    const expectedRoute = '/transactions/report/999/list/edit/123/create-sub-transaction/INDIVIDUAL_RECEIPT';
    const routerNavigateByUrlSpy = spyOn(testRouter, 'navigateByUrl');
    component.navigateTo(NavigationDestination.CHILD, '123', ScheduleATransactionTypes.INDIVIDUAL_RECEIPT);
    expect(routerNavigateByUrlSpy).toHaveBeenCalledOnceWith(expectedRoute);
  });

  it('#navigateTo NavigationDestination.PARENT should navigate', () => {
    const transaction = { ...testTransaction } as Transaction;
    transaction.parent_transaction_id = '333';
    component.transactionType = {
      transaction: transaction,
    } as TransactionType;
    const expectedRoute = '/transactions/report/999/list/edit/333';
    const routerNavigateByUrlSpy = spyOn(testRouter, 'navigateByUrl');
    component.navigateTo(NavigationDestination.PARENT);
    expect(routerNavigateByUrlSpy).toHaveBeenCalledOnceWith(expectedRoute);
  });

  it('#navigateTo default should navigate', () => {
    component.transactionType = TransactionTypeUtils.factory('INDIVIDUAL_RECEIPT');
    if (component.transactionType) {
      component.transactionType.transaction = testTransaction;
    }
    const expectedRoute = '/transactions/report/999/list';
    const routerNavigateByUrlSpy = spyOn(testRouter, 'navigateByUrl');
    component.navigateTo(NavigationDestination.LIST);
    expect(routerNavigateByUrlSpy).toHaveBeenCalledOnceWith(expectedRoute);
  });

  it('#onContactLookupSelect IND should handle null form', () => {
    const testContact = new Contact();
    testContact.id = '123';
    testContact.type = ContactTypes.INDIVIDUAL;
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

  it('#onContactLookupSelect INDIVIDUAL should set fields', () => {
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
    testContact.type = ContactTypes.INDIVIDUAL;
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

  it('#onContactLookupSelect INDIVIDUAL should set fields', () => {
    const testEntityType = ContactTypes.INDIVIDUAL;

    const testContact = new Contact();
    testContact.id = '123';
    testContact.type = ContactTypes.INDIVIDUAL;
    testContact.last_name = 'testLastName';
    testContact.first_name = 'testFirstName';
    testContact.middle_name = 'testMiddleName';
    testContact.prefix = 'testPrefix';
    testContact.suffix = 'testSuffix';
    testContact.employer = 'testEmployer';
    testContact.occupation = 'testOccupation';
    testContact.street_1 = 'testStreet1';
    testContact.street_2 = 'testStreet2';
    testContact.city = 'testCity';
    testContact.state = 'testState';
    testContact.zip = 'testZip';

    const testContactSelectItem: SelectItem<Contact> = {
      value: testContact,
    };

    component.form.addControl('entity_type', { value: testEntityType });
    component.onContactLookupSelect(testContactSelectItem);
  });
  it('#onContactLookupSelect INDIVIDUAL should calculate aggregate', () => {
    component.transactionType = TransactionTypeUtils.factory(
      ScheduleATransactionTypes.INDIVIDUAL_RECEIPT
    ) as TransactionType;
    component.doInit(component.form, new ValidateService(), component.transactionType, component.contactId$);
    component.transactionType.transaction = component.transactionType.getNewTransaction();

    const testEntityType = ContactTypes.INDIVIDUAL;

    const testContact = new Contact();
    testContact.id = '123';
    testContact.type = ContactTypes.INDIVIDUAL;
    testContact.last_name = 'testLastName';
    testContact.first_name = 'testFirstName';
    testContact.middle_name = 'testMiddleName';
    testContact.prefix = 'testPrefix';
    testContact.suffix = 'testSuffix';
    testContact.employer = 'testEmployer';
    testContact.occupation = 'testOccupation';
    testContact.street_1 = 'testStreet1';
    testContact.street_2 = 'testStreet2';
    testContact.city = 'testCity';
    testContact.state = 'testState';
    testContact.zip = 'testZip';

    const testContactSelectItem: SelectItem<Contact> = {
      value: testContact,
    };

    component.form.addControl('entity_type', { value: testEntityType });
    component.form.get('contribution_amount')?.setValue(1111);
    component.form.get('contribution_date')?.setValue('2022-03-02');

    const getPreviousTransactionSpy = spyOn(testTransactionService, 'getPreviousTransaction').and.returnValue(
      of(testTransaction)
    );
    component.onContactLookupSelect(testContactSelectItem);
    expect(getPreviousTransactionSpy).toHaveBeenCalledTimes(1);
  });

  it('#onContactLookupSelect ORG should handle null form', () => {
    const testContact = new Contact();
    testContact.id = '123';
    testContact.type = ContactTypes.ORGANIZATION;
    const testContactSelectItem: SelectItem<Contact> = {
      value: testContact,
    };

    component.form.setControl('entity_type', new FormControl(ContactTypes.ORGANIZATION));
    component.form.setControl('contributor_organization_name', null);
    component.onContactLookupSelect(testContactSelectItem);
    expect(component.form.get('contributor_organization_name')?.value).toBeFalsy();
  });

  it('#onContactLookupSelect ORGANIZATION should set fields', () => {
    const testEntityType = ContactTypes.ORGANIZATION;
    const testOrganizationName = 'testOrganizationName';
    const testContact = new Contact();
    testContact.id = '123';
    testContact.type = ContactTypes.ORGANIZATION;
    testContact.name = testOrganizationName;

    const testContactSelectItem: SelectItem<Contact> = {
      value: testContact,
    };

    component.form.addControl('entity_type', { value: testEntityType });
    component.onContactLookupSelect(testContactSelectItem);
    const organizationNameFormControlValue = component.form.get('contributor_organization_name')?.value;

    expect(organizationNameFormControlValue === testOrganizationName).toBeTrue();
  });

  it('#onContactLookupSelect COMMITTEE should set fields', () => {
    const testEntityType = ContactTypes.COMMITTEE;
    const testCommitteeName = 'testCommitteeName';
    const testContact = new Contact();
    testContact.id = '123';
    testContact.type = ContactTypes.COMMITTEE;
    testContact.name = testCommitteeName;

    const testContactSelectItem: SelectItem<Contact> = {
      value: testContact,
    };

    component.form.addControl('entity_type', { value: testEntityType });
    component.onContactLookupSelect(testContactSelectItem);
    const committeeNameFormControlValue = component.form.get('contributor_organization_name')?.value;

    expect(committeeNameFormControlValue === testCommitteeName).toBeTrue();
  });
});
