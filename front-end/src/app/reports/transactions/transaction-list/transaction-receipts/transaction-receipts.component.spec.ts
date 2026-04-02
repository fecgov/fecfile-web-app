/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Mock } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { getTestIndividualReceipt, testMockStore } from 'app/shared/utils/unit-test.utils';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { TransactionReceiptsComponent } from './transaction-receipts.component';
import { TransactionSchAService } from 'app/shared/services/transaction-schA.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { ScheduleATransactionTypes } from 'app/shared/models';
import { selectActiveReport } from 'app/store/active-report.selectors';

describe('TransactionReceiptsComponent', () => {
  let fixture: ComponentFixture<TransactionReceiptsComponent>;
  let component: TransactionReceiptsComponent;
  let router: Router;
  let testItemService: TransactionSchAService;
  let testConfirmationService: ConfirmationService;
  let selectSignalSpy: Mock;
  let confirmSpy: Mock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, SelectModule, FormsModule, TransactionReceiptsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
        provideMockStore(testMockStore()),
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
    const store = TestBed.inject(Store);
    selectSignalSpy = vi.spyOn(store, 'selectSignal');
    fixture = TestBed.createComponent(TransactionReceiptsComponent);
    router = TestBed.inject(Router);
    testItemService = TestBed.inject(TransactionSchAService);
    testItemService.delete = async (): Promise<null> => {
      return null;
    };
    testConfirmationService = TestBed.inject(ConfirmationService);
    component = fixture.componentInstance;
    confirmSpy = vi.spyOn(testConfirmationService, 'confirm');
    confirmSpy.mockImplementation((confirmation: Confirmation) => {
      if (confirmation.accept) return confirmation?.accept();
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses report id equality comparator when selecting active report', () => {
    const signalCall = vi.mocked(selectSignalSpy).mock.calls.find(
      ([selector, options]) =>
        selector === selectActiveReport &&
        typeof (
          options as
            | {
                equal?: unknown;
              }
            | undefined
        )?.equal === 'function',
    );
    expect(signalCall).toBeDefined();

    const options = signalCall?.[1] as {
      equal: (
        a:
          | {
              id?: string;
            }
          | undefined,
        b:
          | {
              id?: string;
            }
          | undefined,
      ) => boolean;
    };
    const equalByReportId = options.equal;

    expect(equalByReportId({ id: 'same-id' }, { id: 'same-id' })).toBe(true);
    expect(equalByReportId({ id: 'left-id' }, { id: 'right-id' })).toBe(false);
    expect(equalByReportId(undefined, { id: 'present' })).toBe(false);
    expect(equalByReportId(undefined, undefined)).toBe(true);
  });

  it('should show the correct row actions', () => {
    const baseReceipt = getTestIndividualReceipt();
    const transaction = Object.assign(baseReceipt, {
      name: 'TEST',
      date: new Date(),
      amount: 100,
      balance: 0,
      aggregate: 0,
      report_code_label: '',
      can_delete: true,
      force_unaggregated: true,
      report_type: 'Form 3X',
    }) as unknown as TransactionListRecord;
    const viewAction = component.rowActions.find((ra) => ra.label === 'View');
    const editAction = component.rowActions.find((ra) => ra.label === 'Edit');
    const aggregateAction = component.rowActions.find((ra) => ra.label === 'Aggregate');
    const unaggregateAction = component.rowActions.find((ra) => ra.label === 'Unaggregate');
    const itemizeAction = component.rowActions.find((ra) => ra.label === 'Itemize');
    const unitemizeAction = component.rowActions.find((ra) => ra.label === 'Unitemize');
    const reattributeAction = component.rowActions.find((ra) => ra.label === 'Reattribute');
    const deleteAction = component.rowActions.find((ra) => ra.label === 'Delete');
    expect(viewAction?.isAvailable(transaction)).toBe(true);
    expect(deleteAction?.isAvailable(transaction)).toBe(false);
    expect(editAction?.isAvailable(transaction)).toBe(false);
    expect(aggregateAction?.isAvailable(transaction)).toBe(false);

    expect(unaggregateAction?.isAvailable({ ...transaction, force_unaggregated: false } as TransactionListRecord)).toBe(
      false,
    );
    expect(itemizeAction?.isAvailable({ ...transaction, itemized: false } as TransactionListRecord)).toBe(false);
    expect(unitemizeAction?.isAvailable({ ...transaction, itemized: true } as TransactionListRecord)).toBe(false);
    (component.reportIsEditable as any) = signal(true);
    expect(viewAction?.isAvailable(transaction)).toBe(false);
    expect(editAction?.isAvailable(transaction)).toBe(true);
    expect(
      deleteAction?.isAvailable({
        ...transaction,
        can_delete: true,
        transaction_type_identifier: '',
      } as TransactionListRecord),
    ).toBe(true);
    expect(
      deleteAction?.isAvailable({
        ...transaction,
        can_delete: true,
        transaction_type_identifier: 'LOAN_REPAYMENT_MADE',
        loan_id: 'test',
      } as TransactionListRecord),
    ).toBe(true);
    expect(
      deleteAction?.isAvailable({
        ...transaction,
        can_delete: true,
        transaction_type_identifier: 'LOAN_RECEIVED_FROM_BANK_RECEIPT',
      } as TransactionListRecord),
    ).toBe(false);
    expect(
      deleteAction?.isAvailable({
        ...transaction,
        can_delete: true,
        transaction_type_identifier: 'LOAN_RECEIVED_FROM_INDIVIDUAL',
        loan_id: 'test',
      } as TransactionListRecord),
    ).toBe(false);
    expect(
      deleteAction?.isAvailable({
        ...transaction,
        can_delete: true,
        transaction_type_identifier: undefined,
      } as TransactionListRecord),
    ).toBe(true);
    expect(aggregateAction?.isAvailable({ ...transaction, force_unaggregated: true } as TransactionListRecord)).toBe(
      true,
    );
    expect(
      unaggregateAction?.isAvailable({
        ...transaction,
        force_unaggregated: false,
      } as TransactionListRecord),
    ).toBe(true);
    expect(itemizeAction?.isAvailable({ ...transaction, itemized: false } as TransactionListRecord)).toEqual(true);
    expect(unitemizeAction?.isAvailable({ ...transaction, itemized: true } as TransactionListRecord)).toEqual(true);
    expect(reattributeAction?.isAvailable({ ...transaction, itemized: false } as TransactionListRecord)).toEqual(true);
    expect(viewAction?.isEnabled(transaction)).toBe(true);
    expect(editAction?.isEnabled(transaction)).toBe(true);
    expect(deleteAction?.isEnabled(transaction)).toBe(true);
    expect(aggregateAction?.isEnabled(transaction)).toBe(true);
    expect(unaggregateAction?.isEnabled(transaction)).toBe(true);
    expect(itemizeAction?.isEnabled(transaction)).toBe(true);
    expect(unitemizeAction?.isEnabled(transaction)).toBe(true);
    expect(reattributeAction?.isEnabled(transaction)).toBe(true);

    expect(
      reattributeAction?.isAvailable({
        ...transaction,
        itemized: false,
        transactionType: TransactionTypeUtils.factory(ScheduleATransactionTypes.PAC_RETURN),
      } as TransactionListRecord),
    ).toEqual(false);
  });

  it('test forceAggregate', async () => {
    const testTransaction: TransactionListRecord = { force_aggregated: null } as unknown as TransactionListRecord;
    vi.spyOn(testItemService, 'unaggregate').mockResolvedValue('');
    await component.forceAggregate(testTransaction);
    expect(testTransaction.force_unaggregated).toBe(false);
  });

  it('test forceUnaggregate', async () => {
    const testTransaction: TransactionListRecord = { force_aggregated: null } as unknown as TransactionListRecord;
    vi.spyOn(testItemService, 'unaggregate').mockResolvedValue('');
    await component.forceUnaggregate(testTransaction);
    expect(testTransaction.force_unaggregated).toBe(true);
  });

  it('test forceItemize', () => {
    const testTransaction: TransactionListRecord = { force_itemized: null } as unknown as TransactionListRecord;
    vi.spyOn(testItemService, 'itemize').mockResolvedValue('');
    component.forceItemize(testTransaction);
    fixture.detectChanges();
    expect(testTransaction.force_itemized).toBe(true);
  });

  it('test forceUnitemize', () => {
    const testTransaction: TransactionListRecord = { force_itemized: null } as unknown as TransactionListRecord;
    vi.spyOn(testItemService, 'itemize').mockResolvedValue('');
    component.forceUnitemize(testTransaction);
    fixture.detectChanges();
    expect(testTransaction.force_itemized).toBe(false);
  });

  it('test editItem', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    const testTransaction: TransactionListRecord = {
      id: 'testId',
      report_ids: ['test'],
    } as unknown as TransactionListRecord;
    component.editItem(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('test deleteItem', () => {
    const deleteSpy = vi.spyOn(testItemService, 'delete');
    const testTransaction: TransactionListRecord = {
      id: 'testId',
      report_ids: ['test'],
    } as unknown as TransactionListRecord;
    component.deleteItem(testTransaction);
    expect(deleteSpy).toHaveBeenCalled();
  });
});
