import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'app/shared/shared.module';
import { TransactionChildrenComponent } from './transaction-children-list-table-base.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransactionSchAService } from 'app/shared/services/transaction-schA.service';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { ScheduleBTransactionTypes } from 'app/shared/models/schb-transaction.model';

describe('TransactionChildrenComponent', () => {
  let fixture: ComponentFixture<TransactionChildrenComponent>;
  let component: TransactionChildrenComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, SharedModule, HttpClientTestingModule, DropdownModule, FormsModule],
      declarations: [TransactionChildrenComponent],
      providers: [
        MessageService,
        ConfirmationService,
        provideMockStore(testMockStore),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: Form3X.fromJSON({}),
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
    fixture = TestBed.createComponent(TransactionChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not filter out any transactions', () => {
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
    ];
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.transactions?.length).toEqual(4);
  });

  it('should sort by name', () => {
    const event$ = {
      data: [
        { contact_1: { first_name: 'A', last_name: 'Z' } },
        { contact_1: { first_name: 'Z', last_name: 'Z' } },
        { contact_1: { first_name: 'A', last_name: 'A' } },
        { contact_1: { name: 'A, Z' } },
      ],
      field: 'name',
      order: 1,
    };

    component.sortMethod(event$);
    expect(event$.data[0].contact_1.last_name).toEqual('A');
    expect(event$.data[0].contact_1.first_name).toEqual('A');
    expect(event$.data[1].contact_1.name).toEqual('A, Z');
    expect(event$.data[2].contact_1.last_name).toEqual('Z');
    expect(event$.data[2].contact_1.first_name).toEqual('A');
    expect(event$.data[3].contact_1.last_name).toEqual('Z');
    expect(event$.data[3].contact_1.first_name).toEqual('Z');

    event$.order = -1;
    component.sortMethod(event$);
    expect(event$.data[3].contact_1.last_name).toEqual('A');
    expect(event$.data[3].contact_1.first_name).toEqual('A');
    expect(event$.data[2].contact_1.name).toEqual('A, Z');
    expect(event$.data[1].contact_1.last_name).toEqual('Z');
    expect(event$.data[1].contact_1.first_name).toEqual('A');
    expect(event$.data[0].contact_1.last_name).toEqual('Z');
    expect(event$.data[0].contact_1.first_name).toEqual('Z');
  });

  it('should sort by amount', () => {
    const event$ = {
      data: [{ amount: 10 }, { amount: 1 }, { amount: 7 }, { amount: 4 }],
      field: 'amount',
      order: 1,
    };

    component.sortMethod(event$);
    expect(event$.data[0].amount).toEqual(1);
    expect(event$.data[1].amount).toEqual(4);
    expect(event$.data[2].amount).toEqual(7);
    expect(event$.data[3].amount).toEqual(10);

    event$.order = -1;
    component.sortMethod(event$);
    expect(event$.data[0].amount).toEqual(10);
    expect(event$.data[1].amount).toEqual(7);
    expect(event$.data[2].amount).toEqual(4);
    expect(event$.data[3].amount).toEqual(1);
  });
});
