import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import {
  NavigationAction,
  NavigationDestination,
  NavigationEvent,
} from 'app/shared/models/transaction-navigation-controls.model';
import { EARMARK_MEMO } from 'app/shared/models/transaction-types/EARMARK_MEMO.model';
import { EARMARK_RECEIPT } from 'app/shared/models/transaction-types/EARMARK_RECEIPT.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { getTestTransactionByType, testMockStore } from 'app/shared/utils/unit-test.utils';
import { Confirmation, ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';
import { Contact } from 'app/shared/models/contact.model';
import { ScheduleBTransactionTypes } from 'app/shared/models/schb-transaction.model';
import { of } from 'rxjs';
import { Router } from '@angular/router';

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
      declarations: [TestDoubleTransactionTypeBaseComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        DatePipe,
        MessageService,
        FormBuilder,
        TransactionService,
        ConfirmationService,
        provideMockStore(testMockStore),
        FecDatePipe,
        ReportService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    testRouter = TestBed.inject(Router);
    testTransaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_EARMARK_RECEIPT) as SchATransaction;
    testTransaction.report_id = '123';
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should catch exception if there is no templateMap', () => {
    const earmarkReceipt = new EARMARK_RECEIPT();
    component.transaction = earmarkReceipt.getNewTransaction();
    const earmarkMemo = new EARMARK_MEMO();
    component.childTransaction = earmarkMemo.getNewTransaction();
    component.childTransaction.transactionType = undefined;
    component.transaction.children = [component.childTransaction];
    expect(() => component.ngOnInit()).toThrow(
      new Error('Fecfile: Template map not found for double transaction component')
    );
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

    component.updateFormWithPrimaryContact(selectContact);
    expect(component.childTransaction.contact_1?.name).toEqual('Name');
  });

  it('positive contribution_amount values should be overriden when the schema requires a negative value', () => {
    component.transaction = getTestTransactionByType(ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_DEPOSITED);
    const childTransaction = getTestTransactionByType(ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL);
    childTransaction.parent_transaction = component.transaction;
    component.transaction.children = [childTransaction];
    component.ngOnInit();

    component.childForm.patchValue({ contribution_amount: 2 });
    expect(component.childForm.get('contribution_amount')?.value).toBe(-2);
  });

  it("should auto-generate the child transaction's purpose description", () => {
    component.transaction = getTestTransactionByType(ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_DEPOSITED);
    const childTransaction = getTestTransactionByType(ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT_DEPOSITED);
    childTransaction.parent_transaction = component.transaction;
    component.transaction.children = [childTransaction];
    component.ngOnInit();

    component.form.get(component.templateMap.first_name)?.setValue('First');
    component.form.get(component.templateMap.last_name)?.setValue('Last');

    expect(component.childForm.get(component.childTemplateMap.purpose_description)?.value).toEqual(
      'Earmarked from First Last (Individual)'
    );
  });

  it('should push changes in the parent to the child for inherited fields', () => {
    component.transaction = getTestTransactionByType(ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT);
    component.childTransaction = getTestTransactionByType(ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT_DEPOSITED);

    expect(component.childTransaction.transactionType?.inheritedFields).toContain('amount');
    component.childForm.get(component.childTemplateMap.amount)?.setValue(0);
    component.form.get(component.templateMap.amount)?.setValue(250);
    expect(component.childForm.get(component.childTemplateMap.amount)?.value).toEqual(250);
  });

  it('should save a parent and child transaction', () => {
    const apiPostSpy = spyOn(transactionService, 'create').and.returnValue(of(testTransaction));
    spyOn(testRouter, 'navigateByUrl').and.callFake(() => Promise.resolve(true));

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
    component.handleNavigate(navEvent);
    expect(apiPostSpy).toHaveBeenCalledTimes(1);
  });
});