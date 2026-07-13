import { DatePipe, formatDate } from '@angular/common';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { environment } from '../../../environments/environment';
import { AggregationGroups, Transaction } from '../models/transaction.model';
import { SchATransaction, ScheduleATransactionTypes } from '../models/scha-transaction.model';
import { testMockStore } from '../utils/unit-test.utils';
import { TransactionService } from './transaction.service';
import { TransactionTypeUtils } from '../utils/transaction-type.utils';
import { HTTP_INTERCEPTORS, HttpStatusCode, provideHttpClient } from '@angular/common/http';
import { HttpErrorInterceptor } from '../interceptors/http-error.interceptor';
import { ScheduleETransactionTypes } from '../models/sche-transaction.model';
import { ScheduleFTransactionTypes } from '../models/schf-transaction.model';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

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
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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

  describe('getPreviousEntityAggregate', () => {
    it('should GET previous transaction', () => {
      const mockResponse = {
        aggregate: 1,
        calendar_ytd_per_election_office: 2,
        aggregate_general_elec_expended: 3,
      };
      const mockTransaction: Transaction = TransactionTypeUtils.factory(
        ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
      ).getNewTransaction();
      mockTransaction.id = 'abc';
      firstValueFrom(service.getPreviousEntityAggregate(mockTransaction, '1', new Date())).then((response) => {
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
      const mockTransaction: Transaction = TransactionTypeUtils.factory(
        ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
      ).getNewTransaction();
      mockTransaction.id = 'abc';
      const promise = firstValueFrom(service.getPreviousEntityAggregate(mockTransaction, '1', new Date()));
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
      const mockTransaction: Transaction = TransactionTypeUtils.factory(
        ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
      ).getNewTransaction();
      mockTransaction.id = 'abc';
      firstValueFrom(service.getPreviousPayeeCandidateAggregate(mockTransaction, '1', new Date(), '2024')).then(
        (response) => {
          expect(response).toEqual(mockResponse.aggregate_general_elec_expended);
        },
      );
      const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/transactions/previous/payee-candidate/?transaction_id=abc&aggregation_group=${AggregationGroups.COORDINATED_PARTY_EXPENDITURES}&contact_2_id=1&date=${formattedDate}&general_election_year=2024`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
      httpTestingController.verify();
    });

    it('should return null', async () => {
      const mockTransaction: Transaction = TransactionTypeUtils.factory(
        ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
      ).getNewTransaction();
      mockTransaction.id = 'abc';
      const promise = firstValueFrom(
        service.getPreviousPayeeCandidateAggregate(mockTransaction, '1', new Date(), '2024'),
      );
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
      const mockTransaction: Transaction = TransactionTypeUtils.factory(
        ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE,
      ).getNewTransaction();
      mockTransaction.id = 'abc';
      const promise = firstValueFrom(
        service.getPreviousElectionAggregate(mockTransaction, new Date(), new Date(), '1', 'A', 'A', 'A'),
      );

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

  describe('cloneSingleTransaction', () => {
    it('should clone an eligible transaction, scrub persisted fields, and create a new record', async () => {
      const source = SchATransaction.fromJSON({
        id: 'source-id',
        transaction_id: 'T-100',
        report_ids: ['old-report'],
        transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
        contribution_amount: 125,
        contribution_aggregate: 500,
        force_unaggregated: true,
        force_itemized: true,
        itemized: true,
        created: '2026-01-01',
        updated: '2026-01-02',
        contact_1: { id: 'contact-id' },
        memo_text: {
          id: 'memo-id',
          report_id: 'old-report',
          transaction_id_number: 'OLD-TRAN-ID',
          transaction_uuid: 'memo-uuid',
          text4000: 'Memo text',
        },
      });

      vi.spyOn(service, 'get').mockResolvedValue(source);
      let createPayload: SchATransaction | undefined;
      const createSpy = vi.spyOn(service, 'create').mockImplementation(async (transaction) => {
        createPayload = SchATransaction.fromJSON(transaction.toJson());
        transaction.id = 'new-id';
        return transaction;
      });

      const clonePromise = service.cloneSingleTransaction('source-id', 'new-report');

      const clone = await clonePromise;

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createPayload).toBeDefined();
      const clonedPayload = createPayload as SchATransaction;
      expect(clonedPayload.id).toBeUndefined();
      expect(clonedPayload.transaction_id).toBeUndefined();
      expect(clonedPayload.report_ids).toEqual(['new-report']);
      expect(clonedPayload.force_unaggregated).toBeUndefined();
      expect(clonedPayload.force_itemized).toBeUndefined();
      expect(clonedPayload.itemized).toBeUndefined();
      expect(clonedPayload.contribution_aggregate).toBeUndefined();
      expect(clonedPayload.contact_1?.id).toEqual('contact-id');
      expect(clonedPayload.contact_1_id).toEqual('contact-id');
      expect(clonedPayload.memo_text?.id).toBeUndefined();
      expect(clonedPayload.memo_text?.report_id).toEqual('new-report');
      expect(clonedPayload.memo_text?.transaction_id_number).toBeUndefined();
      expect(clonedPayload.memo_text?.transaction_uuid).toBeUndefined();
      expect(clonedPayload.memo_text_id).toBeUndefined();
      expect(clone.id).toEqual('new-id');
      expect(clone.report_ids).toEqual(['new-report']);
      expect(clone.contact_1?.id).toEqual('contact-id');

      httpTestingController.verify();
    });

    it('should reject non-cloneable transaction types before create', async () => {
      const source = SchATransaction.fromJSON({
        id: 'source-id',
        transaction_type_identifier: ScheduleATransactionTypes.EARMARK_MEMO,
      });

      vi.spyOn(service, 'get').mockResolvedValue(source);
      const createSpy = vi.spyOn(service, 'create');

      const clonePromise = service.cloneSingleTransaction('source-id', 'new-report');

      await expect(clonePromise).rejects.toThrow('FECfile+: transaction type is not eligible for cloning.');
      expect(createSpy).not.toHaveBeenCalled();
      httpTestingController.verify();
    });

    it('should reject allowed types that are reattribution or redesignation copies before create', async () => {
      const source = SchATransaction.fromJSON({
        id: 'source-id',
        transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
        reatt_redes_id: 'original-id',
        reattribution_redesignation_tag: 'REATTRIBUTED',
      });

      vi.spyOn(service, 'get').mockResolvedValue(source);
      const createSpy = vi.spyOn(service, 'create');

      await expect(service.cloneSingleTransaction('source-id', 'new-report')).rejects.toThrow(
        'FECfile+: transaction type is not eligible for cloning.',
      );

      expect(createSpy).not.toHaveBeenCalled();
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
        expect(true).toBe(true);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/transactions/1/`);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });

  describe('isCloneable', () => {
    it('should return true only for clone-eligible transactions', () => {
      expect(
        service.isCloneable({
          transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
        }),
      ).toBe(true);
      expect(
        service.isCloneable({
          transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
          parent_transaction_id: '10',
        }),
      ).toBe(false);
      expect(
        service.isCloneable({
          transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
          reatt_redes_id: 'original-id',
          reattribution_redesignation_tag: 'REATTRIBUTED',
        }),
      ).toBe(false);
      expect(service.isCloneable(undefined)).toBe(false);
    });
  });

  describe('multiSaveReattRedes', () => {
    it('should PUT an array of records', () => {
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
    });
  });
});
