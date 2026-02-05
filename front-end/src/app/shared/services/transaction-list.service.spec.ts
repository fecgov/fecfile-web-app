import { DatePipe } from '@angular/common';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { environment } from '../../../environments/environment';
import { ListRestResponse } from '../models/rest-api.model';
import { SchATransaction, ScheduleATransactionTypes } from '../models/scha-transaction.model';
import { testMockStore } from '../utils/unit-test.utils';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { HttpErrorInterceptor } from '../interceptors/http-error.interceptor';
import { Form3X } from '../models/reports/form-3x.model';
import { TransactionListService } from './transaction-list.service';
import { TransactionListRecord } from '../models/transaction-list-record.model';

describe('TransactionListService', () => {
  let service: TransactionListService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        TransactionListService,
        provideMockStore(testMockStore()),
        DatePipe,
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TransactionListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTableData', () => {
    it('should return a list of contacts', () => {
      const mockResponse: ListRestResponse = {
        count: 2,
        next: 'https://next-page',
        previous: 'https://previous-page',
        pageNumber: 1,
        results: [
          SchATransaction.fromJSON({
            id: 1,
            transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
          }),
          SchATransaction.fromJSON({
            id: 2,
            transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
          }),
        ],
      };

      service.getTableData().then((response: ListRestResponse) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/transactions/?page=1&ordering=line_label,created`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });

  describe('delete', () => {
    it('should DELETE a record', () => {
      const mockResponse = null;
      const a: SchATransaction = SchATransaction.fromJSON({
        id: '1',
        transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      });
      const transaction: TransactionListRecord = {
        ...a,
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

      service.delete(transaction).then(() => {
        expect(true).toBeTrue();
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/transactions/1/`);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });

  describe('addToReport', () => {
    it('should add a transaction to a report', fakeAsync(() => {
      const a: SchATransaction = SchATransaction.fromJSON({
        id: '1',
        transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
      });
      const transaction: TransactionListRecord = {
        ...a,
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

      const report: Form3X = Form3X.fromJSON({
        id: '2',
      });

      service.addToReport(transaction, report).then((response) => {
        expect(response.ok).toBeTrue();
      });
      tick(100);
      const req = httpTestingController.expectOne(`${environment.apiUrl}/transactions/add-to-report/`);
      expect(req.request.method).toEqual('POST');
      req.flush(transaction);
      httpTestingController.verify();
    }));
  });
});
