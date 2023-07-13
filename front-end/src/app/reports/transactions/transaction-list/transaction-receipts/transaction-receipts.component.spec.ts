import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'app/shared/shared.module';
import { TransactionReceiptsComponent } from './transaction-receipts.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransactionSchAService } from 'app/shared/services/transaction-schA.service';
import { Transaction } from 'app/shared/models/transaction.model';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';

describe('TransactionReceiptsComponent', () => {
  let fixture: ComponentFixture<TransactionReceiptsComponent>;
  let component: TransactionReceiptsComponent;
  let router: Router;
  let testItemService: TransactionSchAService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, SharedModule, HttpClientTestingModule],
      declarations: [TransactionReceiptsComponent],
      providers: [
        MessageService,
        ConfirmationService,
        provideMockStore(testMockStore),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: F3xSummary.fromJSON({}),
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
    fixture = TestBed.createComponent(TransactionReceiptsComponent);
    router = TestBed.inject(Router);
    testItemService = TestBed.inject(TransactionSchAService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the correct row actions', () => {
    expect(component.rowActions[0].isAvailable()).toEqual(true);
    expect(component.rowActions[1].isAvailable()).toEqual(false);
    expect(component.rowActions[2].isAvailable({ itemized: false })).toEqual(false);
    expect(component.rowActions[3].isAvailable({ itemized: true })).toEqual(false);
    component.reportIsEditable = true;
    expect(component.rowActions[0].isAvailable()).toEqual(false);
    expect(component.rowActions[1].isAvailable()).toEqual(true);
    expect(component.rowActions[2].isAvailable({ itemized: false })).toEqual(true);
    expect(component.rowActions[3].isAvailable({ itemized: true })).toEqual(true);
    expect(component.rowActions[0].isEnabled({})).toEqual(true);
    expect(component.rowActions[1].isEnabled({})).toEqual(true);
    expect(component.rowActions[2].isEnabled({})).toEqual(true);
    expect(component.rowActions[3].isEnabled({})).toEqual(true);
  });

  it('test forceItemize', () => {
    spyOn(testItemService, 'update').and.returnValue(of());
    const testTransaction: Transaction = { force_itemized: null } as unknown as Transaction;
    component.forceItemize(testTransaction);
    expect(testTransaction.force_itemized).toBe(true);
  });

  it('test forceUnitemize', () => {
    spyOn(testItemService, 'update').and.returnValue(of());
    const testTransaction: Transaction = { force_itemized: null } as unknown as Transaction;
    component.forceUnitemize(testTransaction);
    expect(testTransaction.force_itemized).toBe(false);
  });

  it('test editItem', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const testTransaction: Transaction = { id: 'testId' } as unknown as Transaction;
    component.editItem(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });
});
