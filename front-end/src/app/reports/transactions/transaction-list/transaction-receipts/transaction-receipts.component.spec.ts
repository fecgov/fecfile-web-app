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
import { Transaction } from 'app/shared/models/transaction.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { SchATransaction } from 'app/shared/models';

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
    const transaction = getTestIndividualReceipt();
    const viewAction = component.rowActions.find((ra) => ra.label === 'View');
    const editAction = component.rowActions.find((ra) => ra.label === 'Edit');
    const aggregateAction = component.rowActions.find((ra) => ra.label === 'Aggregate');
    const unaggregateAction = component.rowActions.find((ra) => ra.label === 'Unaggregate');
    const itemizeAction = component.rowActions.find((ra) => ra.label === 'Itemize');
    const unitemizeAction = component.rowActions.find((ra) => ra.label === 'Unitemize');
    const reattributeAction = component.rowActions.find((ra) => ra.label === 'Reattribute');
    const deleteAction = component.rowActions.find((ra) => ra.label === 'Delete');
    expect(viewAction?.isAvailable(transaction)).toBeTrue();
    expect(deleteAction?.isAvailable({ ...transaction, can_delete: true } as SchATransaction)).toBeFalse();
    expect(editAction?.isAvailable(transaction)).toBeFalse();
    expect(aggregateAction?.isAvailable({ ...transaction, force_unaggregated: true } as SchATransaction)).toBeFalse();
    expect(
      unaggregateAction?.isAvailable({ ...transaction, force_unaggregated: false } as SchATransaction),
    ).toBeFalse();
    expect(itemizeAction?.isAvailable({ ...transaction, itemized: false } as SchATransaction)).toBeFalse();
    expect(unitemizeAction?.isAvailable({ ...transaction, itemized: true } as SchATransaction)).toBeFalse();
    (component.reportIsEditable as any) = signal(true);
    expect(viewAction?.isAvailable(transaction)).toBeFalse();
    expect(editAction?.isAvailable(transaction)).toBeTrue();
    expect(
      deleteAction?.isAvailable({
        ...transaction,
        can_delete: true,
        transaction_type_identifier: '',
      } as SchATransaction),
    ).toBeTrue();
    expect(
      deleteAction?.isAvailable({
        ...transaction,
        can_delete: true,
        transaction_type_identifier: 'LOAN_REPAYMENT_MADE',
        loan_id: 'test',
      } as SchATransaction),
    ).toBeTrue();
    expect(
      deleteAction?.isAvailable({
        ...transaction,
        can_delete: true,
        transaction_type_identifier: 'LOAN_RECEIVED_FROM_BANK_RECEIPT',
      } as SchATransaction),
    ).toBeFalse();
    expect(
      deleteAction?.isAvailable({
        ...transaction,
        can_delete: true,
        transaction_type_identifier: 'LOAN_RECEIVED_FROM_INDIVIDUAL',
        loan_id: 'test',
      } as SchATransaction),
    ).toBeFalse();
    expect(
      deleteAction?.isAvailable({
        ...transaction,
        can_delete: true,
        transaction_type_identifier: undefined,
      } as SchATransaction),
    ).toBeTrue();
    expect(aggregateAction?.isAvailable({ ...transaction, force_unaggregated: true } as SchATransaction)).toBeTrue();
    expect(
      unaggregateAction?.isAvailable({
        ...transaction,
        force_unaggregated: false,
      } as SchATransaction),
    ).toBeTrue();
    expect(itemizeAction?.isAvailable({ ...transaction, itemized: false } as SchATransaction)).toEqual(true);
    expect(unitemizeAction?.isAvailable({ ...transaction, itemized: true } as SchATransaction)).toEqual(true);
    expect(reattributeAction?.isAvailable({ ...transaction, itemized: false } as SchATransaction)).toEqual(true);
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
      } as SchATransaction),
    ).toEqual(false);
  });

  it('test forceAggregate', async () => {
    const testTransaction: Transaction = { force_aggregated: null } as unknown as Transaction;
    spyOn(testItemService, 'update').and.resolveTo(testTransaction);
    await component.forceAggregate(testTransaction);
    expect(testTransaction.force_unaggregated).toBe(false);
  });

  it('test forceUnaggregate', async () => {
    const testTransaction: Transaction = { force_aggregated: null } as unknown as Transaction;
    spyOn(testItemService, 'update').and.returnValue(Promise.resolve(testTransaction));
    await component.forceUnaggregate(testTransaction);
    expect(testTransaction.force_unaggregated).toBe(true);
  });

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
});
