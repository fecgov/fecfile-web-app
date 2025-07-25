import { DatePipe, formatDate } from '@angular/common';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { environment } from '../../../environments/environment';
import { AggregationGroups, Transaction } from '../models/transaction.model';
import { ListRestResponse } from '../models/rest-api.model';
import { SchATransaction, ScheduleATransactionTypes } from '../models/scha-transaction.model';
import { testMockStore } from '../utils/unit-test.utils';
import { TransactionService } from './transaction.service';
import { TransactionTypeUtils } from '../utils/transaction-type.utils';
import { HTTP_INTERCEPTORS, HttpStatusCode, provideHttpClient } from '@angular/common/http';
import { HttpErrorInterceptor } from '../interceptors/http-error.interceptor';
import { ScheduleETransactionTypes } from '../models/sche-transaction.model';
import { Form3X } from '../models/form-3x.model';
import { ScheduleFTransactionTypes, SchFTransaction } from '../models/schf-transaction.model';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        TransactionService,
        provideMockStore(testMockStore),
        DatePipe,
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TransactionService);
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

  describe('get', () => {
    it('should GET a record', () => {
      const mockResponse: SchATransaction = SchATransaction.fromJSON({
        id: 1,
        transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      });

      service.get('1').then((response) => {
        expect(response?.id).toEqual(mockResponse.id);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/transactions/1/`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });

  describe('getPreviousTransactionForAggregate', () => {
    it('should GET previous transaction', () => {
      const mockResponse: SchATransaction = SchATransaction.fromJSON({
        id: 1,
        transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
        aggregation_group: AggregationGroups.GENERAL,
      });
      const mockTransaction: Transaction = TransactionTypeUtils.factory(
        ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
      ).getNewTransaction();
      mockTransaction.id = 'abc';
      service.getPreviousTransactionForAggregate(mockTransaction, '1', new Date()).then((response) => {
        expect(response?.id).toEqual(mockResponse.id);
      });
      const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/transactions/previous/entity/?transaction_id=abc&contact_1_id=1&date=${formattedDate}&aggregation_group=${AggregationGroups.GENERAL}`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
      httpTestingController.verify();
    });

    it('should return undefined', () => {
      const mockTransaction: Transaction = TransactionTypeUtils.factory(
        ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
      ).getNewTransaction();
      mockTransaction.id = 'abc';
      service.getPreviousTransactionForAggregate(mockTransaction, '1', new Date()).then((response) => {
        expect(response).toEqual(undefined);
      });
      const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/transactions/previous/entity/?transaction_id=abc&contact_1_id=1&date=${formattedDate}&aggregation_group=${AggregationGroups.GENERAL}`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush({}, { status: HttpStatusCode.NotFound, statusText: 'not found' });
      httpTestingController.verify();
    });
  });

  describe('getPreviousTransactionForPayeeCandidate', () => {
    it('should GET previous transaction', () => {
      const mockResponse: SchFTransaction = SchFTransaction.fromJSON({
        id: 1,
        transaction_type_identifier: ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
        aggregation_group: AggregationGroups.COORDINATED_PARTY_EXPENDITURES,
      });
      const mockTransaction: Transaction = TransactionTypeUtils.factory(
        ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
      ).getNewTransaction();
      mockTransaction.id = 'abc';
      service.getPreviousTransactionForPayeeCandidate(mockTransaction, '1', new Date(), '2024').then((response) => {
        expect(response?.id).toEqual(mockResponse.id);
      });
      const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/transactions/previous/payee-candidate/?transaction_id=abc&contact_2_id=1&date=${formattedDate}&aggregation_group=${AggregationGroups.COORDINATED_PARTY_EXPENDITURES}&general_election_year=2024`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
      httpTestingController.verify();
    });

    it('should return undefined', () => {
      const mockTransaction: Transaction = TransactionTypeUtils.factory(
        ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
      ).getNewTransaction();
      mockTransaction.id = 'abc';
      service.getPreviousTransactionForPayeeCandidate(mockTransaction, '1', new Date(), '2024').then((response) => {
        expect(response).toEqual(undefined);
      });
      const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/transactions/previous/payee-candidate/?transaction_id=abc&contact_2_id=1&date=${formattedDate}&aggregation_group=${AggregationGroups.COORDINATED_PARTY_EXPENDITURES}&general_election_year=2024`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush({}, { status: HttpStatusCode.NotFound, statusText: 'not found' });
      httpTestingController.verify();
    });
  });

  describe('getPreviousTransactionForCalendarYTD', () => {
    it('should return undefined', () => {
      const mockTransaction: Transaction = TransactionTypeUtils.factory(
        ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE,
      ).getNewTransaction();
      mockTransaction.id = 'abc';
      service
        .getPreviousTransactionForCalendarYTD(mockTransaction, new Date(), new Date(), '1', 'A', 'A', 'A')
        .then((response) => {
          expect(response).toEqual(undefined);
        });
      const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/transactions/previous/election/?transaction_id=abc&date=${formattedDate}&aggregation_group=${AggregationGroups.INDEPENDENT_EXPENDITURE}&election_code=1&candidate_office=A&candidate_state=A&candidate_district=A`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush({}, { status: HttpStatusCode.NotFound, statusText: 'not found' });
      httpTestingController.verify();
    });
  });

  describe('create', () => {
    it('should POST a record', () => {
      const schATransaction: SchATransaction = SchATransaction.fromJSON({
        id: '1',
        transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      });

      service.create(schATransaction).then((response) => {
        expect(response?.id).toEqual(schATransaction.id);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/transactions/`);
      expect(req.request.method).toEqual('POST');
      req.flush(schATransaction);
      httpTestingController.verify();
    });
  });

  describe('update', () => {
    it('should PUT  a record', () => {
      const schATransaction: SchATransaction = SchATransaction.fromJSON({
        id: '1',
        transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      });

      service.update(schATransaction).then((response) => {
        expect(response?.id).toEqual(schATransaction.id);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/transactions/1/`);
      expect(req.request.method).toEqual('PUT');
      req.flush(schATransaction);
      httpTestingController.verify();
    });
  });

  describe('delete', () => {
    it('should DELETE a record', () => {
      const mockResponse = null;
      const schATransaction: SchATransaction = SchATransaction.fromJSON({
        id: '1',
        transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      });

      service.delete(schATransaction).then(() => {
        expect(true).toBeTrue();
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/transactions/1/`);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });

  describe('multiSaveReattRedes', () => {
    it('should PUT an array of records', fakeAsync(() => {
      const transactions: SchATransaction[] = [
        SchATransaction.fromJSON({
          id: '1',
          transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
        }),
        SchATransaction.fromJSON({
          id: '2',
          transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
        }),
        SchATransaction.fromJSON({
          id: '3',
          transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
        }),
      ];

      service.multiSaveReattRedes(transactions).then((response) => {
        expect(response[0]?.id).toEqual('1');
        expect(response[1]?.id).toEqual('2');
        expect(response[2]?.id).toEqual('3');
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/transactions/multisave/reattribution/`);
      expect(req.request.method).toEqual('PUT');
      req.flush(transactions.map((t) => t.id));
      httpTestingController.verify();
      tick(100);
    }));
  });

  describe('addToReport', () => {
    it('should add a transaction to a report', fakeAsync(() => {
      const transaction: SchATransaction = SchATransaction.fromJSON({
        id: '1',
        transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
      });

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
