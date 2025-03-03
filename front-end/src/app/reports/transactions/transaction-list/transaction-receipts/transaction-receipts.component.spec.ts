import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Form3X } from 'app/shared/models/form-3x.model';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { TransactionReceiptsComponent } from './transaction-receipts.component';
import { TransactionSchAService } from 'app/shared/services/transaction-schA.service';
import { ScheduleIds, Transaction } from 'app/shared/models/transaction.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TransactionReceiptsComponent', () => {
  let fixture: ComponentFixture<TransactionReceiptsComponent>;
  let component: TransactionReceiptsComponent;
  let router: Router;
  let testItemService: TransactionSchAService;
  let testConfirmationService: ConfirmationService;
  let confirmSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, SelectModule, FormsModule, TransactionReceiptsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
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
        TransactionSchAService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TransactionReceiptsComponent);
    router = TestBed.inject(Router);
    testItemService = TestBed.inject(TransactionSchAService);
    testItemService.delete = async (): Promise<null> => {
      return null;
    };
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
    expect(viewAction?.isAvailable()).toBeTrue();
    expect(
      deleteAction?.isAvailable({
        can_delete: true,
        transactionType: { scheduleId: ScheduleIds.A },
      }),
    ).toBeFalse();
    expect(editAction?.isAvailable()).toBeFalse();
    expect(
      aggregateAction?.isAvailable({ force_unaggregated: true, transactionType: { scheduleId: ScheduleIds.A } }),
    ).toBeFalse();
    expect(
      unaggregateAction?.isAvailable({
        force_unaggregated: false,
        transactionType: { scheduleId: ScheduleIds.A },
      }),
    ).toBeFalse();
    expect(itemizeAction?.isAvailable({ itemized: false })).toBeFalse();
    expect(unitemizeAction?.isAvailable({ itemized: true })).toBeFalse();
    component.reportIsEditable = true;
    expect(viewAction?.isAvailable()).toBeFalse();
    expect(editAction?.isAvailable()).toBeTrue();
    expect(
      deleteAction?.isAvailable({
        can_delete: true,
        transaction_type_identifier: '',
        transactionType: { scheduleId: ScheduleIds.A },
      }),
    ).toBeTrue();
    expect(
      deleteAction?.isAvailable({
        can_delete: true,
        transaction_type_identifier: 'LOAN_REPAYMENT_MADE',
        loan_id: 'test',
        transactionType: { scheduleId: ScheduleIds.A },
      }),
    ).toBeTrue();
    expect(
      deleteAction?.isAvailable({
        can_delete: true,
        transaction_type_identifier: 'LOAN_RECEIVED_FROM_BANK_RECEIPT',
        transactionType: { scheduleId: ScheduleIds.A },
      }),
    ).toBeFalse();
    expect(
      deleteAction?.isAvailable({
        can_delete: true,
        transaction_type_identifier: 'LOAN_RECEIVED_FROM_INDIVIDUAL',
        loan_id: 'test',
        transactionType: { scheduleId: ScheduleIds.A },
      }),
    ).toBeFalse();
    expect(
      deleteAction?.isAvailable({
        can_delete: true,
        transaction_type_identifier: undefined,
        transactionType: { scheduleId: ScheduleIds.A },
      }),
    ).toBeTrue();
    expect(
      aggregateAction?.isAvailable({ force_unaggregated: true, transactionType: { scheduleId: ScheduleIds.A } }),
    ).toBeTrue();
    expect(
      unaggregateAction?.isAvailable({
        force_unaggregated: false,
        transactionType: { scheduleId: ScheduleIds.A },
      }),
    ).toBeTrue();
    expect(itemizeAction?.isAvailable({ itemized: false, transactionType: { scheduleId: ScheduleIds.A } })).toEqual(
      true,
    );
    expect(unitemizeAction?.isAvailable({ itemized: true, transactionType: { scheduleId: ScheduleIds.A } })).toEqual(
      true,
    );
    expect(reattributeAction?.isAvailable({ itemized: false, transactionType: { scheduleId: ScheduleIds.A } })).toEqual(
      true,
    );
    expect(viewAction?.isEnabled({})).toBeTrue();
    expect(editAction?.isEnabled({})).toBeTrue();
    expect(deleteAction?.isEnabled({})).toBeTrue();
    expect(aggregateAction?.isEnabled({})).toBeTrue();
    expect(unaggregateAction?.isEnabled({})).toBeTrue();
    expect(itemizeAction?.isEnabled({})).toBeTrue();
    expect(unitemizeAction?.isEnabled({})).toBeTrue();
    expect(reattributeAction?.isEnabled({})).toBeTrue();
  });

  it('test forceAggregate', fakeAsync(() => {
    const testTransaction: Transaction = { force_aggregated: null } as unknown as Transaction;
    spyOn(testItemService, 'update').and.returnValue(Promise.resolve(testTransaction));
    component.forceAggregate(testTransaction).then(() => {
      expect(testTransaction.force_unaggregated).toBe(false);
    });
  }));

  it('test forceUnaggregate', fakeAsync(() => {
    const testTransaction: Transaction = { force_aggregated: null } as unknown as Transaction;
    spyOn(testItemService, 'update').and.returnValue(Promise.resolve(testTransaction));
    component.forceUnaggregate(testTransaction);
    tick(500);
    expect(testTransaction.force_unaggregated).toBe(true);
  }));

  it('test forceItemize', fakeAsync(() => {
    const testTransaction: Transaction = { force_itemized: null } as unknown as Transaction;
    spyOn(testItemService, 'update').and.returnValue(Promise.resolve(testTransaction));
    component.forceItemize(testTransaction);
    tick(500);
    expect(testTransaction.force_itemized).toBe(true);
  }));

  it('test forceUnitemize', fakeAsync(() => {
    const testTransaction: Transaction = { force_itemized: null } as unknown as Transaction;
    spyOn(testItemService, 'update').and.returnValue(Promise.resolve(testTransaction));
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

  it('test deleteItem', () => {
    const deleteSpy = spyOn(testItemService, 'delete').and.callThrough();
    const testTransaction: Transaction = { id: 'testId', report_ids: ['test'] } as unknown as Transaction;
    component.deleteItem(testTransaction);
    expect(deleteSpy).toHaveBeenCalled();
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
