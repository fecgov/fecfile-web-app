import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { F3xReport } from 'app/shared/models/report-types/f3x-report.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'app/shared/shared.module';
import { TransactionGuarantorsComponent } from './transaction-guarantors.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransactionSchAService } from 'app/shared/services/transaction-schA.service';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypes } from 'app/shared/models/schb-transaction.model';
import { ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { SchC2Transaction, ScheduleC2TransactionTypes } from 'app/shared/models/schc2-transaction.model';

describe('TransactionGuarantorsComponent', () => {
  let fixture: ComponentFixture<TransactionGuarantorsComponent>;
  let component: TransactionGuarantorsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, SharedModule, HttpClientTestingModule, DropdownModule, FormsModule],
      declarations: [TransactionGuarantorsComponent],
      providers: [
        MessageService,
        ConfirmationService,
        provideMockStore(testMockStore),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: F3xReport.fromJSON({}),
              },
              params: {
                reportId: '999',
              },
            },
          },
        },
        {
          provide: TransactionSchAService,
          useValue: {
            get: (transactionId: string) =>
              of(
                SchATransaction.fromJSON({
                  id: transactionId,
                  transaction_type_identifier: 'OFFSET_TO_OPERATING_EXPENDITURES',
                })
              ),
            getTableData: () => of([]),
            update: () => of([]),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionGuarantorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter to only the loan guarantors', () => {
    component.transactions = [
      SchATransaction.fromJSON({
        transaction_type_identifier: ScheduleCTransactionTypes.LOAN_BY_COMMITTEE,
      }),
      SchATransaction.fromJSON({
        transaction_type_identifier: ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT_UNDEPOSITED,
      }),
      SchATransaction.fromJSON({
        transaction_type_identifier: ScheduleATransactionTypes.EARMARK_MEMO,
      }),
      SchATransaction.fromJSON({
        transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_JF_TRANSFER_MEMO,
      }),
      SchC2Transaction.fromJSON({
        transaction_type_identifier: ScheduleC2TransactionTypes.C2_LOAN_GUARANTOR,
      }),
    ];
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.transactions?.length).toEqual(1);
    expect(component.transactions?.[0]?.transaction_type_identifier).toEqual(
      ScheduleC2TransactionTypes.C2_LOAN_GUARANTOR
    );
  });
});
