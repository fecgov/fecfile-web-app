import { DatePipe, formatDate } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { environment } from '../../../environments/environment';
import { TransactionType } from '../models/transaction-types/transaction-type.model';
import { ListRestResponse } from '../models/rest-api.model';
import { SchATransaction, ScheduleATransactionTypes } from '../models/scha-transaction.model';
import { AggregationGroups } from '../models/transaction.model';
import { testMockStore } from '../utils/unit-test.utils';
import { TransactionService } from './transaction.service';
import { TransactionTypeUtils } from '../utils/transaction-type.utils';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionService, provideMockStore(testMockStore), DatePipe],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getTableData() should return a list of contacts', () => {
    const mockResponse: ListRestResponse = {
      count: 2,
      next: 'https://next-page',
      previous: 'https://previous-page',
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

    service.getTableData().subscribe((response: ListRestResponse) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/transactions/schedule-a/?page=1&ordering=form_type`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('#get() should GET a record', () => {
    const mockResponse: SchATransaction = SchATransaction.fromJSON({
      id: 1,
      transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
    });

    service.get('1').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/transactions/schedule-a/1/`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it('#getPreviousTransaction() should GET previous transaction', () => {
    const mockResponse: SchATransaction = SchATransaction.fromJSON({
      id: 1,
      transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      aggregation_group: AggregationGroups.GENERAL,
    });
    const mockTransactionType: TransactionType | undefined = TransactionTypeUtils.factory(
      ScheduleATransactionTypes.INDIVIDUAL_RECEIPT
    );
    if (mockTransactionType) {
      mockTransactionType.transaction = mockResponse;
      mockTransactionType.transaction = SchATransaction.fromJSON({
        id: 'abc',
        transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      });
      service.getPreviousTransaction(mockTransactionType, '1', new Date()).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });
    }
    const formattedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/transactions/schedule-a/previous/?transaction_id=abc&contact_id=1&date=${formattedDate}&aggregation_group=${AggregationGroups.GENERAL}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
    httpTestingController.verify();
  });

  xit('#create() should POST a record', () => {
    const schATransaction: SchATransaction = SchATransaction.fromJSON({
      id: '1',
      transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
    });

    service.create(schATransaction).subscribe((response) => {
      expect(response).toEqual(schATransaction);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/transactions/schedule-a/`);
    expect(req.request.method).toEqual('POST');
    req.flush(schATransaction);
    httpTestingController.verify();
  });

  it('#update() should PUT  a record', () => {
    const schATransaction: SchATransaction = SchATransaction.fromJSON({
      id: '1',
      transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
    });

    service.update(schATransaction).subscribe((response) => {
      expect(response).toEqual(schATransaction);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/transactions/schedule-a/1/`);
    expect(req.request.method).toEqual('PUT');
    req.flush(schATransaction);
    httpTestingController.verify();
  });

  it('#delete() should DELETE a record', () => {
    const mockResponse = null;
    const schATransaction: SchATransaction = SchATransaction.fromJSON({
      id: '1',
      transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
    });

    service.delete(schATransaction).subscribe((response: null) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/transactions/schedule-a/1`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);
    httpTestingController.verify();
  });
});
