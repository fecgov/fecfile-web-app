import { DatePipe, formatDate } from '@angular/common';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { environment } from '../../../environments/environment';
import { testMockStore } from '../utils/unit-test.utils';
import { TransactionService } from './transaction.service';
import { HTTP_INTERCEPTORS, HttpStatusCode, provideHttpClient } from '@angular/common/http';
import { HttpErrorInterceptor } from '../interceptors/http-error.interceptor';
import {
  ScheduleATransactionTypes,
  AggregationGroups,
  ScheduleFTransactionTypes,
  ScheduleETransactionTypes,
} from '../models/type-enums';
import { TransactionUtils } from '../utils/transaction.utils';
import { SchATransaction } from '../models/scha-transaction.model';
import { ReportIsEditableGuard } from '../guards/report-is-editable.guard';

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
        provideMockStore(testMockStore()),
        DatePipe,
        ReportIsEditableGuard,
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should GET a record', async () => {
      const mockResponse = await TransactionUtils.getFromJSON({
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

  describe('getPreviousEntityAggregate', () => {
    it('should GET previous transaction', async () => {
      const mockResponse = {
        aggregate: 1,
        calendar_ytd_per_election_office: 2,
        aggregate_general_elec_expended: 3,
      };
      const mockTransaction = await TransactionUtils.createNewTransactionByIdentifier(
        ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
      );
      mockTransaction.id = 'abc';
      service.getPreviousEntityAggregate(mockTransaction, '1', new Date()).then((response) => {
        expect(response).toEqual(mockResponse.aggregate);
      });
      const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/transactions/previous/entity/?transaction_id=abc&aggregation_group=${AggregationGroups.GENERAL}&contact_1_id=1&date=${formattedDate}`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
      httpTestingController.verify();
    });

    it('should return null', async () => {
      const mockTransaction = await TransactionUtils.createNewTransactionByIdentifier(
        ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
      );
      mockTransaction.id = 'abc';
      const promise = service.getPreviousEntityAggregate(mockTransaction, '1', new Date());
      const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/transactions/previous/entity/?transaction_id=abc&aggregation_group=${AggregationGroups.GENERAL}&contact_1_id=1&date=${formattedDate}`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush({}, { status: HttpStatusCode.NotFound, statusText: 'not found' });
      const response = await promise;
      expect(response).toBeNull();
      httpTestingController.verify();
    });
  });

  describe('getPreviousPayeeCandidateAggregate', () => {
    it('should GET previous transaction', async () => {
      const mockResponse = {
        aggregate: 1,
        calendar_ytd_per_election_office: 2,
        aggregate_general_elec_expended: 3,
      };
      const mockTransaction = await TransactionUtils.createNewTransactionByIdentifier(
        ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
      );
      mockTransaction.id = 'abc';
      service.getPreviousPayeeCandidateAggregate(mockTransaction, '1', new Date(), '2024').then((response) => {
        expect(response).toEqual(mockResponse.aggregate_general_elec_expended);
      });
      const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/transactions/previous/payee-candidate/?transaction_id=abc&aggregation_group=${AggregationGroups.COORDINATED_PARTY_EXPENDITURES}&contact_2_id=1&date=${formattedDate}&general_election_year=2024`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
      httpTestingController.verify();
    });

    it('should return null', async () => {
      const mockTransaction = await TransactionUtils.createNewTransactionByIdentifier(
        ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
      );
      mockTransaction.id = 'abc';
      const promise = service.getPreviousPayeeCandidateAggregate(mockTransaction, '1', new Date(), '2024');
      const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/transactions/previous/payee-candidate/?transaction_id=abc&aggregation_group=${AggregationGroups.COORDINATED_PARTY_EXPENDITURES}&contact_2_id=1&date=${formattedDate}&general_election_year=2024`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(
        {
          aggregate: 0,
          calendar_ytd_per_election_office: 0,
          aggregate_general_elec_expended: 0,
        },
        { status: HttpStatusCode.NotFound, statusText: 'not found' },
      );
      const response = await promise;
      expect(response).toBeNull();
      httpTestingController.verify();
    });
  });

  describe('getPreviousElectionAggregate', () => {
    it('should return null', async () => {
      const mockTransaction = await TransactionUtils.createNewTransactionByIdentifier(
        ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE,
      );
      mockTransaction.id = 'abc';
      const promise = service.getPreviousElectionAggregate(mockTransaction, new Date(), new Date(), '1', 'A', 'A', 'A');

      const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/transactions/previous/election/?transaction_id=abc&aggregation_group=${AggregationGroups.INDEPENDENT_EXPENDITURE}&date=${formattedDate}&election_code=1&candidate_office=A&candidate_state=A&candidate_district=A`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(
        {
          aggregate: 0,
          calendar_ytd_per_election_office: 0,
          aggregate_general_elec_expended: 0,
        },
        { status: HttpStatusCode.NotFound, statusText: 'not found' },
      );
      const response = await promise;
      expect(response).toBeNull();
      httpTestingController.verify();
    });
  });

  describe('create', () => {
    it('should POST a record', async () => {
      const schATransaction = await TransactionUtils.getFromJSON({
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
    it('should PUT  a record', async () => {
      const schATransaction = await TransactionUtils.getFromJSON({
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
    it('should DELETE a record', async () => {
      const mockResponse = null;
      const schATransaction = await TransactionUtils.getFromJSON({
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
    it('should PUT an array of records', fakeAsync(async () => {
      const transactions = [
        await TransactionUtils.hydrateTransaction(
          { id: '1', transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT },
          SchATransaction,
        ),
        await TransactionUtils.hydrateTransaction(
          { id: '2', transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT },
          SchATransaction,
        ),
        await TransactionUtils.hydrateTransaction(
          { id: '3', transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT },
          SchATransaction,
        ),
      ];

      const promise = service.multiSaveReattRedes(transactions);
      const req = httpTestingController.expectOne(`${environment.apiUrl}/transactions/multisave/reattribution/`);
      expect(req.request.method).toEqual('PUT');
      req.flush(transactions.map((t) => t.id));
      const response = await promise;

      expect(response[0]?.id).toEqual('1');
      expect(response[1]?.id).toEqual('2');
      expect(response[2]?.id).toEqual('3');
    }));
  });
});
