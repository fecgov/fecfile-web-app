/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
    const transaction = {
      ...getTestIndividualReceipt(),
      name: 'TEST',
      date: new Date(),
      amount: 100,
      balance: 0,
      aggregate: 0,
      report_code_label: '',
      can_delete: true,
      force_unaggregated: true,
      report_type: 'Form 3X',
    } as unknown as TransactionListRecord;
    const viewAction = component.rowActions.find((ra) => ra.label === 'View');
    const editAction = component.rowActions.find((ra) => ra.label === 'Edit');
    const aggregateAction = component.rowActions.find((ra) => ra.label === 'Aggregate');
    const unaggregateAction = component.rowActions.find((ra) => ra.label === 'Unaggregate');
    const itemizeAction = component.rowActions.find((ra) => ra.label === 'Itemize');
    const unitemizeAction = component.rowActions.find((ra) => ra.label === 'Unitemize');
    const reattributeAction = component.rowActions.find((ra) => ra.label === 'Reattribute');
    const deleteAction = component.rowActions.find((ra) => ra.label === 'Delete');
    expect(viewAction?.isAvailable(transaction)).toBeTrue();
    expect(deleteAction?.isAvailable(transaction)).toBeFalse();
    expect(editAction?.isAvailable(transaction)).toBeFalse();
    expect(aggregateAction?.isAvailable(transaction)).toBeFalse();

    expect(
      unaggregateAction?.isAvailable({ ...transaction, force_unaggregated: false } as TransactionListRecord),
    ).toBeFalse();
    expect(itemizeAction?.isAvailable({ ...transaction, itemized: false } as TransactionListRecord)).toBeFalse();
    expect(unitemizeAction?.isAvailable({ ...transaction, itemized: true } as TransactionListRecord)).toBeFalse();
    (component.reportIsEditable as any) = signal(true);
    expect(viewAction?.isAvailable(transaction)).toBeFalse();
    expect(editAction?.isAvailable(transaction)).toBeTrue();
    expect(
      deleteAction?.isAvailable({
        ...transaction,
        can_delete: true,
        transaction_type_identifier: '',
      } as TransactionListRecord),
    ).toBeTrue();
    expect(
      deleteAction?.isAvailable({
        ...transaction,
        can_delete: true,
        transaction_type_identifier: 'LOAN_REPAYMENT_MADE',
        loan_id: 'test',
      } as TransactionListRecord),
    ).toBeTrue();
    expect(
      deleteAction?.isAvailable({
        ...transaction,
        can_delete: true,
        transaction_type_identifier: 'LOAN_RECEIVED_FROM_BANK_RECEIPT',
      } as TransactionListRecord),
    ).toBeFalse();
    expect(
      deleteAction?.isAvailable({
        ...transaction,
        can_delete: true,
        transaction_type_identifier: 'LOAN_RECEIVED_FROM_INDIVIDUAL',
        loan_id: 'test',
      } as TransactionListRecord),
    ).toBeFalse();
    expect(
      deleteAction?.isAvailable({
        ...transaction,
        can_delete: true,
        transaction_type_identifier: undefined,
      } as TransactionListRecord),
    ).toBeTrue();
    expect(
      aggregateAction?.isAvailable({ ...transaction, force_unaggregated: true } as TransactionListRecord),
    ).toBeTrue();
    expect(
      unaggregateAction?.isAvailable({
        ...transaction,
        force_unaggregated: false,
      } as TransactionListRecord),
    ).toBeTrue();
    expect(itemizeAction?.isAvailable({ ...transaction, itemized: false } as TransactionListRecord)).toEqual(true);
    expect(unitemizeAction?.isAvailable({ ...transaction, itemized: true } as TransactionListRecord)).toEqual(true);
    expect(reattributeAction?.isAvailable({ ...transaction, itemized: false } as TransactionListRecord)).toEqual(true);
    expect(viewAction?.isEnabled(transaction)).toBeTrue();
    expect(editAction?.isEnabled(transaction)).toBeTrue();
    expect(deleteAction?.isEnabled(transaction)).toBeTrue();
    expect(aggregateAction?.isEnabled(transaction)).toBeTrue();
    expect(unaggregateAction?.isEnabled(transaction)).toBeTrue();
    expect(itemizeAction?.isEnabled(transaction)).toBeTrue();
    expect(unitemizeAction?.isEnabled(transaction)).toBeTrue();
    expect(reattributeAction?.isEnabled(transaction)).toBeTrue();

    expect(
      reattributeAction?.isAvailable({
        ...transaction,
        itemized: false,
        transactionType: { ...transaction.transactionType, negativeAmountValueOnly: true },
      } as TransactionListRecord),
    ).toEqual(false);
  });

  it('test forceAggregate', async () => {
    const testTransaction: TransactionListRecord = { force_aggregated: null } as unknown as TransactionListRecord;
    spyOn(testItemService, 'unaggregate').and.resolveTo('');
    await component.forceAggregate(testTransaction);
    expect(testTransaction.force_unaggregated).toBe(false);
  });

  it('test forceUnaggregate', async () => {
    const testTransaction: TransactionListRecord = { force_aggregated: null } as unknown as TransactionListRecord;
    spyOn(testItemService, 'unaggregate').and.resolveTo('');
    await component.forceUnaggregate(testTransaction);
    expect(testTransaction.force_unaggregated).toBe(true);
  });

  it('test forceItemize', fakeAsync(() => {
    const testTransaction: TransactionListRecord = { force_itemized: null } as unknown as TransactionListRecord;
    spyOn(testItemService, 'itemize').and.resolveTo('');
    component.forceItemize(testTransaction);
    tick(500);
    expect(testTransaction.force_itemized).toBe(true);
  }));

  it('test forceUnitemize', fakeAsync(() => {
    const testTransaction: TransactionListRecord = { force_itemized: null } as unknown as TransactionListRecord;
    spyOn(testItemService, 'itemize').and.resolveTo('');
    component.forceUnitemize(testTransaction);
    tick(500);
    expect(testTransaction.force_itemized).toBe(false);
  }));

  it('test editItem', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const testTransaction: TransactionListRecord = {
      id: 'testId',
      report_ids: ['test'],
    } as unknown as TransactionListRecord;
    component.editItem(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('test deleteItem', () => {
    const deleteSpy = spyOn(testItemService, 'delete').and.callThrough();
    const testTransaction: TransactionListRecord = {
      id: 'testId',
      report_ids: ['test'],
    } as unknown as TransactionListRecord;
    component.deleteItem(testTransaction);
    expect(deleteSpy).toHaveBeenCalled();
  });
});
