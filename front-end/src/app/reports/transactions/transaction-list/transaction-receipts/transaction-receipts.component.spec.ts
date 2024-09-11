import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Form3X } from 'app/shared/models/form-3x.model';
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
                  can_delete: true,
                }),
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
    const viewAction = component.rowActions.find((ra) => ra.label === 'View');
    const editAction = component.rowActions.find((ra) => ra.label === 'Edit');
    const aggregateAction = component.rowActions.find((ra) => ra.label === 'Aggregate');
    const unaggregateAction = component.rowActions.find((ra) => ra.label === 'Unaggregate');
    const itemizeAction = component.rowActions.find((ra) => ra.label === 'Itemize');
    const unitemizeAction = component.rowActions.find((ra) => ra.label === 'Unitemize');
    const reattributeAction = component.rowActions.find((ra) => ra.label === 'Reattribute');
    const deleteAction = component.rowActions.find((ra) => ra.label === 'Delete');
    expect(viewAction?.isAvailable()).toEqual(true);
    expect(
      deleteAction?.isAvailable({
        can_delete: true,
        transactionType: { scheduleId: ScheduleIds.A },
      }),
    ).toEqual(false);
    expect(editAction?.isAvailable()).toEqual(false);
    expect(
      aggregateAction?.isAvailable({ force_unaggregated: true, transactionType: { scheduleId: ScheduleIds.A } }),
    ).toEqual(false);
    expect(
      unaggregateAction?.isAvailable({
        force_unaggregated: false,
        transactionType: { scheduleId: ScheduleIds.A },
      }),
    ).toEqual(false);
    expect(itemizeAction?.isAvailable({ itemized: false })).toEqual(false);
    expect(unitemizeAction?.isAvailable({ itemized: true })).toEqual(false);
    component.reportIsEditable = true;
    expect(viewAction?.isAvailable()).toEqual(false);
    expect(editAction?.isAvailable()).toEqual(true);
    expect(
      deleteAction?.isAvailable({
        can_delete: true,
        transactionType: { scheduleId: ScheduleIds.A },
      }),
    ).toEqual(true);
    expect(
      aggregateAction?.isAvailable({ force_unaggregated: true, transactionType: { scheduleId: ScheduleIds.A } }),
    ).toEqual(true);
    expect(
      unaggregateAction?.isAvailable({
        force_unaggregated: false,
        transactionType: { scheduleId: ScheduleIds.A },
      }),
    ).toEqual(true);
    expect(itemizeAction?.isAvailable({ itemized: false, transactionType: { scheduleId: ScheduleIds.A } })).toEqual(
      true,
    );
    expect(unitemizeAction?.isAvailable({ itemized: true, transactionType: { scheduleId: ScheduleIds.A } })).toEqual(
      true,
    );
    expect(reattributeAction?.isAvailable({ itemized: false, transactionType: { scheduleId: ScheduleIds.A } })).toEqual(
      true,
    );
    expect(viewAction?.isEnabled({})).toEqual(true);
    expect(editAction?.isEnabled({})).toEqual(true);
    expect(deleteAction?.isEnabled({})).toEqual(true);
    expect(aggregateAction?.isEnabled({})).toEqual(true);
    expect(unaggregateAction?.isEnabled({})).toEqual(true);
    expect(itemizeAction?.isEnabled({})).toEqual(true);
    expect(unitemizeAction?.isEnabled({})).toEqual(true);
    expect(reattributeAction?.isEnabled({})).toEqual(true);
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
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const testTransaction: Transaction = { id: 'testId', report_ids: ['test'] } as unknown as Transaction;
    component.editItem(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });

  describe('format id', () => {
    it('should return empty string if null id', () => {
      const str = component.formatId(null);
      expect(str).toBe('');
    });

    it('should properly format', () => {
      const str = component.formatId('abcdefghijklmnopqrstuvwxyz');
      expect(str).toBe('ABCDEFGH');
    });
  });
});
