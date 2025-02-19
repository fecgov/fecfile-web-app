import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { Contact, ContactTypes } from 'app/shared/models/contact.model';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypes } from 'app/shared/models/schb-transaction.model';
import {
  NavigationAction,
  NavigationDestination,
  NavigationEvent,
} from 'app/shared/models/transaction-navigation-controls.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { getTestTransactionByType, testMockStore } from 'app/shared/utils/unit-test.utils';
import { Confirmation, ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';
import { TransactionType } from '../../models/transaction-type.model';
import { TransactionContactUtils } from './transaction-contact.utils';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ROUTES } from 'app/routes';

class TestDoubleTransactionTypeBaseComponent extends DoubleTransactionTypeBaseComponent {
  override formProperties: string[] = [
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
    'text4000',
  ];
  override childFormProperties: string[] = [
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
    'text4000',
  ];

  override ngOnInit(): void {
    super.ngOnInit();
  }
}

describe('DoubleTransactionTypeBaseComponent', () => {
  let component: TestDoubleTransactionTypeBaseComponent;
  let fixture: ComponentFixture<TestDoubleTransactionTypeBaseComponent>;
  let testTransaction: SchATransaction;
  let testConfirmationService: ConfirmationService;
  let transactionService: TransactionService;
  let reportService: ReportService;
  let testRouter: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDoubleTransactionTypeBaseComponent],
      providers: [
        provideMockStore(testMockStore),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(ROUTES),
        DatePipe,
        MessageService,
        FormBuilder,
        TransactionService,
        ConfirmationService,
        provideMockStore(testMockStore),
        FecDatePipe,
        ReportService,
        TransactionService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    testRouter = TestBed.inject(Router);
    testTransaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_EARMARK_RECEIPT) as SchATransaction;
    testTransaction.id = 'ABC';
    testTransaction.report_ids = ['123'];
    testTransaction.children = [
      getTestTransactionByType(ScheduleATransactionTypes.PAC_EARMARK_MEMO) as SchATransaction,
    ];
    reportService = TestBed.inject(ReportService);
    spyOn(reportService, 'isEditable').and.returnValue(true);
    testConfirmationService = TestBed.inject(ConfirmationService);
    spyOn(testConfirmationService, 'confirm').and.callFake((confirmation: Confirmation) => {
      if (confirmation.accept) return confirmation?.accept();
    });
    transactionService = TestBed.inject(TransactionService);

    fixture = TestBed.createComponent(TestDoubleTransactionTypeBaseComponent);
    component = fixture.componentInstance;
    component.transaction = testTransaction;
    component.childTransaction = testTransaction;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('init', () => {
    it('should fail to initialize if no transaction', () => {
      component.transaction = undefined;
      try {
        component.ngOnInit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        expect(err.message).toBe('Fecfile: Template map not found for transaction component');
      }
    });

    it('should throw error if no child transaction', () => {
      spyOn(component, 'getChildTransaction').and.callFake(() => undefined);
      try {
        component.ngOnInit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        expect(err.message).toBe('Fecfile: Child transaction not found for double-entry transaction form');
      }
    });

    it('should throw error if child transaction is missing template map', () => {
      spyOn(component, 'getChildTransaction').and.callFake(() => {
        const t = testTransaction.children?.[0] as SchATransaction;
        t.transactionType = undefined as unknown as TransactionType;
        return t;
      });
      try {
        component.ngOnInit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        expect(err.message).toBe(
          'Fecfile: Template map not found for double transaction double-entry transaction form',
        );
      }
    });
  });

  it("should set the child transaction's contact when its shared with the parent", () => {
    component.transaction = testTransaction;
    component.childTransaction = testTransaction.children?.[0] as SchATransaction;
    if (component.childTransaction.transactionType) {
      component.childTransaction.transactionType.useParentContact = true;
    }

    const contact = new Contact();
    contact.name = 'Name';
    component.transaction.contact_1 = contact;

    const selectContact: SelectItem<Contact> = {
      value: contact,
    };
    fixture.detectChanges();
    component.updateFormWithPrimaryContact(selectContact);
    expect(component.childTransaction.contact_1?.name).toEqual('Name');
  });

  it("should auto-generate the child transaction's purpose description", () => {
    const trans: SchATransaction = getTestTransactionByType(
      ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_DEPOSITED,
    ) as SchATransaction;
    trans.entity_type = ContactTypes.INDIVIDUAL;
    const childTransaction = getTestTransactionByType(ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT_DEPOSITED);
    component.transaction = trans;
    spyOn(component, 'getChildTransaction').and.callFake(() => {
      childTransaction.parent_transaction = component.transaction;
      return childTransaction;
    });
    component.ngOnInit();

    expect(component.childTransaction?.parent_transaction).toBeTruthy();
    component.form.get(component.templateMap.first_name)?.setValue('First');
    component.form.get(component.templateMap.last_name)?.setValue('Last');

    expect(component.childForm.get(component.childTemplateMap.purpose_description)?.value).toEqual(
      'Earmarked from First Last (Individual)',
    );
  });

  it('should push changes in the parent to the child for inherited fields', () => {
    component.transaction = getTestTransactionByType(ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT);
    component.childTransaction = getTestTransactionByType(ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT_DEPOSITED);
    spyOn(component, 'getChildTransaction').and.returnValue(
      getTestTransactionByType(ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT_DEPOSITED),
    );
    component.ngOnInit();
    expect(component.childTransaction.transactionType?.getInheritedFields(component.childTransaction)).toContain(
      'amount',
    );
    component.childForm.get(component.childTemplateMap.amount)?.setValue(0);
    component.form.get(component.templateMap.amount)?.setValue(250);
    expect(component.childForm.get(component.childTemplateMap.amount)?.value).toEqual(250);
  });

  it('should save a parent and child transaction', async () => {
    const apiPostSpy = spyOn(transactionService, 'create').and.returnValue(Promise.resolve(testTransaction));
    spyOn(testRouter, 'navigateByUrl').and.callFake(() => Promise.resolve(true));
    testTransaction.id = undefined;
    if (testTransaction.children) {
      component.childTransaction = testTransaction.children[0];
      component.childTransaction.parent_transaction = component.transaction;
    }

    const navEvent = new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, component.transaction);

    // Save valid form values
    component.form.patchValue({
      entity_type: 'COM',
      contributor_organization_name: 'org222 name',
      contributor_middle_name: '',
      contributor_prefix: '',
      contributor_suffix: '',
      contributor_street_1: 'street1',
      contributor_street_2: '',
      contributor_city: 'city',
      contributor_state: 'DC',
      contributor_zip: '20001',
      contributor_employer: 'emp',
      contributor_occupation: 'occ',
      contribution_date: new Date(2023, 6, 12),
      contribution_amount: 5,
      contribution_aggregate: 200,
      contribution_purpose_descrip: 'individual',
      donor_committee_fec_id: 'C12345678',
      donor_committee_name: 'name',
      memo_code: '',
      text4000: '',
    });
    Object.keys(component.form.controls).forEach((key) => {
      component.form.get(key)?.updateValueAndValidity();
    });
    component.childForm.patchValue({
      entity_type: 'IND',
      contributor_organization_name: 'zzzz',
      contributor_last_name: 'fname',
      contributor_first_name: 'lname',
      contributor_middle_name: '',
      contributor_prefix: '',
      contributor_suffix: '',
      contributor_street_1: 'street1',
      contributor_street_2: '',
      contributor_city: 'city',
      contributor_state: 'DC',
      contributor_zip: '20001',
      contributor_employer: 'emp',
      contributor_occupation: 'occ',
      contribution_date: new Date(2023, 6, 12),
      contribution_amount: 5,
      contribution_aggregate: 200,
      contribution_purpose_descrip: 'individual',
      memo_code: true,
      text4000: '',
    });
    Object.keys(component.childForm.controls).forEach((key) => {
      component.childForm.get(key)?.updateValueAndValidity();
    });

    await component.save(navEvent);
    expect(apiPostSpy).toHaveBeenCalledTimes(1);
  });

  describe('save', () => {
    it('should bail out if transactions are invalid', () => {
      component.transaction = undefined;
      expect(function () {
        component.save(new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, component.transaction));
      }).toThrow(new Error('Fecfile: No transactions submitted for double-entry transaction form.'));
    });
  });

  describe('confirmation$', () => {
    it('should return false if not child transaction', async () => {
      component.childTransaction = undefined;
      const v = await component.confirmation$;
      expect(v).toBeFalse();
    });
  });

  describe('childUpdateFormWithPrimaryContact', () => {
    it('should throw an error if no child transaction', () => {
      spyOn(TransactionContactUtils, 'updateFormWithPrimaryContact').and.callFake(() => {
        return;
      });
      const contact = new Contact();
      component.childTransaction = undefined;
      expect(function () {
        component.childUpdateFormWithPrimaryContact({ value: contact });
      }).toThrow(new Error('Fecfile: Missing child transaction.'));
    });

    it('should call updateInheritedFields', () => {
      const updateInheritedFieldsSpy = spyOn(component, 'updateInheritedFields');
      spyOn(TransactionContactUtils, 'updateFormWithPrimaryContact').and.callFake(() => {
        return;
      });
      const contact = new Contact();
      component.childUpdateFormWithPrimaryContact({ value: contact });
      expect(updateInheritedFieldsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
