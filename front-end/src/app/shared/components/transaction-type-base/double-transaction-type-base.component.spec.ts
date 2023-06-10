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
import { ConfirmationService, MessageService } from 'primeng/api';
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';
import { Contact } from 'app/shared/models/contact.model';

class TestDoubleTransactionTypeBaseComponent extends DoubleTransactionTypeBaseComponent {
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
    'text4000',
  ];

  childFormProperties: string[] = [
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
  let reportService: ReportService;

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
    testTransaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_EARMARK_RECEIPT) as SchATransaction;
    testTransaction.contact = Contact.fromJSON({});
    testTransaction.children = [
      getTestTransactionByType(ScheduleATransactionTypes.PAC_EARMARK_MEMO) as SchATransaction,
    ];
    testTransaction.children[0].contact = Contact.fromJSON({});
    reportService = TestBed.inject(ReportService);
    spyOn(reportService, 'isEditable').and.returnValue(true);
    testConfirmationService = TestBed.inject(ConfirmationService);
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

  it('positive contribution_amount values should be overriden when the schema requires a negative value', () => {
    component.childTransaction = getTestTransactionByType(
      ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL
    );
    component.childOnInit();

    component.childForm.patchValue({ contribution_amount: 2 });
    expect(component.childForm.value.contribution_amount).toBe(-2);
  });

  it('should save a parent and child transaction', () => {
    const componentNavigateToSpy = spyOn(testConfirmationService, 'confirm');

    if (testTransaction.children) {
      component.childTransaction = testTransaction.children[0];
      component.childTransaction.parent_transaction = component.transaction;
    }

    // Save invalid form values
    const navEvent = new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, component.transaction);
    component.save(navEvent);

    // Save valid form values
    component.form.patchValue({
      entity_type: 'IND',
      contributor_organization_name: 'org222 name',
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
    component.save(navEvent);
    expect(componentNavigateToSpy).toHaveBeenCalledTimes(1);
  });
});
