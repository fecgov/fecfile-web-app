import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'app/shared/shared.module';
import { TransactionReceiptsComponent } from './transaction-receipts.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransactionSchAService } from 'app/shared/services/transaction-schA.service';
import { ScheduleIds, Transaction } from 'app/shared/models/transaction.model';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';

describe('TransactionReceiptsComponent', () => {
  let fixture: ComponentFixture<TransactionReceiptsComponent>;
  let component: TransactionReceiptsComponent;
  let router: Router;
  let testItemService: TransactionSchAService;
  let testConfirmationService: ConfirmationService;
  let confirmSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, SharedModule, HttpClientTestingModule, DropdownModule, FormsModule],
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
    fixture = TestBed.createComponent(TransactionReceiptsComponent);
    router = TestBed.inject(Router);
    testItemService = TestBed.inject(TransactionSchAService);
    testConfirmationService = TestBed.inject(ConfirmationService);
    component = fixture.componentInstance;
    confirmSpy = spyOn(testConfirmationService, 'confirm');
    confirmSpy.and.callFake((confirmation: Confirmation) => {
      if (confirmation.accept) return confirmation?.accept();
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the correct row actions', () => {
    expect(component.rowActions[0].isAvailable()).toEqual(true);
    expect(component.rowActions[1].isAvailable()).toEqual(false);
    expect(
      component.rowActions[2].isAvailable({ force_unaggregated: true, transactionType: { scheduleId: ScheduleIds.A } })
    ).toEqual(false);
    expect(
      component.rowActions[3].isAvailable({ force_unaggregated: false, transactionType: { scheduleId: ScheduleIds.A } })
    ).toEqual(false);
    expect(component.rowActions[4].isAvailable({ itemized: false })).toEqual(false);
    expect(component.rowActions[5].isAvailable({ itemized: true })).toEqual(false);
    component.reportIsEditable = true;
    expect(component.rowActions[0].isAvailable()).toEqual(false);
    expect(component.rowActions[1].isAvailable()).toEqual(true);
    expect(
      component.rowActions[2].isAvailable({ force_unaggregated: true, transactionType: { scheduleId: ScheduleIds.A } })
    ).toEqual(true);
    expect(
      component.rowActions[3].isAvailable({ force_unaggregated: false, transactionType: { scheduleId: ScheduleIds.A } })
    ).toEqual(true);
    expect(
      component.rowActions[4].isAvailable({ itemized: false, transactionType: { scheduleId: ScheduleIds.A } })
    ).toEqual(true);
    expect(
      component.rowActions[5].isAvailable({ itemized: true, transactionType: { scheduleId: ScheduleIds.A } })
    ).toEqual(true);
    expect(component.rowActions[0].isEnabled({})).toEqual(true);
    expect(component.rowActions[1].isEnabled({})).toEqual(true);
    expect(component.rowActions[2].isEnabled({})).toEqual(true);
    expect(component.rowActions[3].isEnabled({})).toEqual(true);
    expect(component.rowActions[4].isEnabled({})).toEqual(true);
    expect(component.rowActions[5].isEnabled({})).toEqual(true);
  });

  it('test forceAggregate', fakeAsync(() => {
    spyOn(testItemService, 'update').and.returnValue(of());
    const testTransaction: Transaction = { force_aggregated: null } as unknown as Transaction;
    component.forceAggregate(testTransaction);
    tick(500);
    expect(testTransaction.force_unaggregated).toBe(false);
  }));

  it('test forceUnaggregate', fakeAsync(() => {
    spyOn(testItemService, 'update').and.returnValue(of());
    const testTransaction: Transaction = { force_aggregated: null } as unknown as Transaction;
    component.forceUnaggregate(testTransaction);
    tick(500);
    expect(testTransaction.force_unaggregated).toBe(true);
  }));

  it('test forceItemize', fakeAsync(() => {
    spyOn(testItemService, 'update').and.returnValue(of());
    const testTransaction: Transaction = { force_itemized: null } as unknown as Transaction;
    component.forceItemize(testTransaction);
    tick(500);
    expect(testTransaction.force_itemized).toBe(true);
  }));

  it('test forceUnitemize', fakeAsync(() => {
    spyOn(testItemService, 'update').and.returnValue(of());
    const testTransaction: Transaction = { force_itemized: null } as unknown as Transaction;
    component.forceUnitemize(testTransaction);
    tick(500);
    expect(testTransaction.force_itemized).toBe(false);
  }));

  it('test editItem', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const testTransaction: Transaction = { id: 'testId' } as unknown as Transaction;
    component.editItem(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });
});
