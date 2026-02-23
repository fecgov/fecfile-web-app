/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { getTestTransactionByType, testMockStore } from 'app/shared/utils/unit-test.utils';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { TransactionGuarantorsComponent } from './transaction-guarantors.component';
import { TransactionSchC2Service } from 'app/shared/services/transaction-schC2.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, signal, viewChild } from '@angular/core';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { ScheduleCTransactionTypes } from 'app/shared/models/type-enums';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  imports: [TransactionGuarantorsComponent],
  standalone: true,
  template: `<app-transaction-guarantors [loan]="loan" />`,
})
class TestHostComponent {
  initialized: Promise<void>;
  component = viewChild.required(TransactionGuarantorsComponent);
  transaction?: Transaction;
  loan?: TransactionListRecord;

  constructor() {
    this.initialized = getTestTransactionByType(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK).then(
      (transaction) => {
        this.transaction = transaction;
        this.loan = {
          ...this.transaction,
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
      },
    );
  }
}

describe('TransactionGuarantorsComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TransactionGuarantorsComponent;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, SelectModule, FormsModule, TransactionGuarantorsComponent],
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
        {
          provide: TransactionSchC2Service,
          useValue: {
            get: (transactionId: string) =>
              of(
                TransactionUtils.getFromJSON({
                  id: transactionId,
                  transaction_type_identifier: 'LOAN_GUARANTOR',
                }),
              ),
            getTableData: () => of([]),
            update: () => of([]),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    await host.initialized;
    component = host.component();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.params()['parent']).toBeUndefined();
  });

  it('should load items with loan', () => {
    host.loan = { id: '1' } as TransactionListRecord;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.params()['parent']).toEqual('1');
  });

  it('should have delete', () => {
    (component.reportIsEditable as any) = signal(true);
    expect(component.rowActions[0].isAvailable(host.loan!)).toEqual(false);
    expect(component.rowActions[1].isAvailable(host.loan!)).toEqual(true);
    expect(component.rowActions[2].isAvailable(host.loan!)).toEqual(true);
    expect(component.rowActions[0].isEnabled(host.loan!)).toEqual(true);
    expect(component.rowActions[1].isEnabled(host.loan!)).toEqual(true);
    expect(component.rowActions[2].isEnabled(host.loan!)).toEqual(true);
  });
});
