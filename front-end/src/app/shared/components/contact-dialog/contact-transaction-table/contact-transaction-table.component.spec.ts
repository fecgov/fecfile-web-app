import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactTransactionTableComponent } from './contact-transaction-table.component';
import { TransactionListService } from 'app/shared/services/transaction-list.service';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { createTestTransactionListRecord } from 'app/shared/utils/unit-test.utils';
import { ListRestResponse } from 'app/shared/models/rest-api.model';
import { Contact } from 'app/shared/models/contact.model';
import { Component, signal, viewChild } from '@angular/core';

@Component({
  imports: [ContactTransactionTableComponent],
  standalone: true,
  template: `<app-contact-transaction-table [contact]="contact()" />`,
})
class TestHostComponent {
  component = viewChild.required(ContactTransactionTableComponent);
  contact = signal(Contact.fromJSON({ id: '123' }));
}

describe('ContactTransactionTableComponent', () => {
  let host: TestHostComponent;
  let component: ContactTransactionTableComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let transactionService: TransactionListService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactTransactionTableComponent],
    }).compileComponents();

    transactionService = TestBed.inject(TransactionListService);
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('transactions', () => {
    it('should route to transaction', async () => {
      const spy = vi.spyOn(component.router, 'navigate').mockResolvedValue(true);
      const testTransactionListRecord = createTestTransactionListRecord();
      testTransactionListRecord.report_ids = ['abc'];
      await component.openTransaction(testTransactionListRecord);
      expect(spy).toHaveBeenCalledWith([
        `reports/transactions/report/${testTransactionListRecord.report_ids?.[0]}/list/${testTransactionListRecord.id}`,
      ]);
    });

    it('should handle pagination', async () => {
      vi.spyOn(transactionService, 'getTableData').mockResolvedValue({
        results: [],
        count: 5,
        pageNumber: 0,
        next: '',
        previous: '',
      } as ListRestResponse);
      await component.loadTransactions();

      expect(component.transactions).toEqual([]);
    });

    it('should not show Form 24s', async () => {
      const testReportCodeLabel = 'APRIL 15 QUARTERLY REPORT (Q1)';
      const transactionListRecord = new TransactionListRecord();
      transactionListRecord.report_code_label = testReportCodeLabel;
      vi.spyOn(transactionService, 'getTableData').mockResolvedValue({
        results: [transactionListRecord],
        count: 1,
        pageNumber: 1,
        next: '',
        previous: '',
      } as ListRestResponse);
      await component.loadTransactions();

      expect(component.transactions[0].report_code_label).toBe(testReportCodeLabel);
    });

    describe('loadTransactions', () => {
      it('should load even without first in event or pagerState', async () => {
        vi.spyOn(transactionService, 'getTableData').mockResolvedValue({
          results: [],
          count: 5,
          pageNumber: 0,
          next: '',
          previous: '',
        } as ListRestResponse);
        await component.loadTransactions();

        expect(component.transactions).toEqual([]);
      });

      it('should load even without first in event', async () => {
        vi.spyOn(transactionService, 'getTableData').mockResolvedValue({
          results: [],
          count: 5,
          pageNumber: 0,
          next: '',
          previous: '',
        } as ListRestResponse);
        await component.loadTransactions();

        expect(component.transactions).toEqual([]);
      });
    });

    it('should get params', async () => {
      component.rowsPerPage.set(5);
      expect(component.params()!['page_size']).toBe(5);
      expect(component.params()!['contact']).toBe('123');
    });
  });
});
