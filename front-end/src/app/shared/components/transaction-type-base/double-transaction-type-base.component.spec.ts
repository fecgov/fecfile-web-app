import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { TransactionService } from 'app/shared/services/transaction.service';
import { getTestTransactionByType, testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';
import { EARMARK_MEMO } from 'app/shared/models/transaction-types/EARMARK_MEMO.model';
import { EARMARK_RECEIPT } from 'app/shared/models/transaction-types/EARMARK_RECEIPT.model';

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
    'memo_text_input',
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
    'memo_text_input',
  ];
}

describe('DoubleTransactionTypeBaseComponent', () => {
  let component: TestDoubleTransactionTypeBaseComponent;
  let fixture: ComponentFixture<TestDoubleTransactionTypeBaseComponent>;
  let testTransaction: SchATransaction;

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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    testTransaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_EARMARK_RECEIPT) as SchATransaction;
    testTransaction.children = [
      getTestTransactionByType(ScheduleATransactionTypes.PAC_EARMARK_MEMO) as SchATransaction,
    ];
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

  // it('positive contribution_amount values should be overriden when the schema requires a negative value', () => {
  //   component.childTransaction = getTestTransactionByType(
  //     ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL
  //   );
  //   component.ngOnInit();
  //   component.childForm.patchValue({ contribution_amount: 2 });
  //   expect(component.childForm.value.contribution_amount).toBe(-2);
  // });
});
