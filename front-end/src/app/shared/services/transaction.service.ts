import { DatePipe } from '@angular/common';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ListRestResponse } from '../models/rest-api.model';
import { AggregationGroups, ScheduleTransaction, Transaction } from '../models/transaction.model';
import { getFromJSON } from '../utils/transaction-type.utils';
import { ApiService, QueryParams } from './api.service';
import { CandidateOfficeTypes } from '../models/contact.model';
import { Report } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService implements TableListService<Transaction> {
  tableDataEndpoint = '/transactions';

  constructor(
    protected apiService: ApiService,
    protected datePipe: DatePipe,
  ) {}

  public getTableData(pageNumber = 1, ordering = '', params: QueryParams = {}): Observable<ListRestResponse> {
    if (!ordering) {
      ordering = 'line_label,created';
    }
    if (ordering === '-line_label,created') {
      ordering = '-line_label,-created';
    }

    return this.apiService
      .get<ListRestResponse>(`${this.tableDataEndpoint}/?page=${pageNumber}&ordering=${ordering}`, params)
      .pipe(
        map((response: ListRestResponse) => {
          response.results = response.results.map((item) => getFromJSON(item));
          response.pageNumber = pageNumber;
          return response;
        }),
      );
  }

  public get(id: string): Observable<ScheduleTransaction> {
    return this.apiService.get<ScheduleTransaction>(`/transactions/${id}/`).pipe(
      map((response) => {
        return getFromJSON(response);
      }),
    );
  }

  public getPreviousTransactionForAggregate(
    transaction: Transaction | undefined,
    contact_1_id: string,
    action_date: Date,
  ): Observable<Transaction | undefined> {
    const actionDateString: string = this.datePipe.transform(action_date, 'yyyy-MM-dd') || '';
    const transaction_id: string = transaction?.id ?? '';
    const aggregation_group: AggregationGroups | undefined =
      (transaction as ScheduleTransaction)?.aggregation_group ?? AggregationGroups.GENERAL;

    if (transaction && action_date && contact_1_id && aggregation_group) {
      return this.apiService
        .get<HttpResponse<Transaction>>(
          '/transactions/previous/entity/',
          {
            transaction_id,
            contact_1_id,
            date: actionDateString,
            aggregation_group,
          },
          [HttpStatusCode.NotFound],
        )
        .pipe(
          map((response) => {
            if (response.status === HttpStatusCode.NotFound) {
              return undefined;
            }
            return getFromJSON(response.body);
          }),
        );
    }
    return of(undefined);
  }

  public getPreviousTransactionForCalendarYTD(
    transaction: Transaction | undefined,
    disbursement_date: Date | undefined,
    dissemination_date: Date | undefined,
    election_code: string | undefined,
    candidate_office: string | undefined,
    candidate_state: string | undefined,
    candidate_district: string | undefined,
  ): Observable<Transaction | undefined> {
    let actionDateString: string = this.datePipe.transform(disbursement_date, 'yyyy-MM-dd') ?? '';
    if (actionDateString.length === 0) {
      actionDateString = this.datePipe.transform(dissemination_date, 'yyyy-MM-dd') ?? '';
    }

    const transaction_id: string = transaction?.id ?? '';
    const aggregation_group: AggregationGroups | undefined =
      (transaction as ScheduleTransaction)?.aggregation_group ?? AggregationGroups.GENERAL;

    if (
      transaction &&
      actionDateString &&
      candidate_office &&
      aggregation_group &&
      election_code &&
      (candidate_state || candidate_office === CandidateOfficeTypes.PRESIDENTIAL) &&
      (candidate_district || candidate_office !== CandidateOfficeTypes.HOUSE)
    ) {
      const params: { [key: string]: string } = {
        transaction_id,
        date: actionDateString,
        aggregation_group,
        election_code,
        candidate_office,
      };
      if (candidate_state) {
        params['candidate_state'] = candidate_state;
      }
      if (candidate_district) {
        params['candidate_district'] = candidate_district;
      }

      return this.apiService
        .get<HttpResponse<Transaction>>('/transactions/previous/election/', params, [HttpStatusCode.NotFound])
        .pipe(
          map((response) => {
            if (response.status === HttpStatusCode.NotFound) {
              return undefined;
            }
            return getFromJSON(response.body);
          }),
        );
    }
    return of(undefined);
  }

  public create(transaction: Transaction): Observable<Transaction> {
    const payload = this.preparePayload(transaction);
    return this.apiService.post<string>(`${transaction.transactionType.apiEndpoint}/`, payload).pipe(
      map((id) => {
        transaction.id = id;
        return transaction;
      }),
    );
  }

  public update(transaction: Transaction): Observable<Transaction> {
    const payload = this.preparePayload(transaction);
    return this.apiService
      .put<string>(`${transaction.transactionType?.apiEndpoint}/${transaction.id}/`, payload, {})
      .pipe(map(() => transaction));
  }

  public delete(transaction: Transaction): Observable<null> {
    return this.apiService.delete<null>(`${transaction.transactionType?.apiEndpoint}/${transaction.id}/`);
  }

  public multiSaveReattRedes(transactions: Transaction[]): Observable<Transaction[]> {
    const payload = transactions.map((t) => this.preparePayload(t));
    return this.apiService
      .put<string[]>(`${transactions[0].transactionType?.apiEndpoint}/multisave/reattribution/`, payload, {})
      .pipe(
        map((ids) => {
          transactions.forEach((t, i) => (t.id = ids[i]));
          return transactions;
        }),
      );
  }

  public addToReport(transaction: Transaction, report: Report): Promise<HttpResponse<string>> {
    const payload = {
      report_id: report.id,
      transaction_id: transaction.id,
    };
    return firstValueFrom(
      this.apiService.post<string>(`${transaction.transactionType?.apiEndpoint}/add-to-report/`, payload, {}, [
        HttpStatusCode.Accepted,
        HttpStatusCode.NotFound,
        HttpStatusCode.BadRequest,
      ]),
    );
  }

  /**
   * Update and prepare a transaction payload as a JSON object to be received by the API.
   * This involves removing excess properties such and transactionType while
   * moving needed data points (such as schedule_id) to the top level of the payload.
   *
   * We do this here because otherwise we are redefining data values in the
   * transaction model that we already have in the transactionType object
   * @param transaction
   */
  private preparePayload(transaction: Transaction) {
    const payload = transaction.toJson();

    // Add flags to the payload used for API processing
    if (transaction.transactionType?.scheduleId) {
      payload['schedule_id'] = transaction.transactionType.scheduleId;
    }
    if (transaction.transactionType?.getUseParentContact(transaction)) {
      payload['use_parent_contact'] = transaction.transactionType.getUseParentContact(transaction);
    }

    delete payload['transactionType'];
    delete payload['reports'];

    if (payload['children']) {
      payload['children'] = transaction.children.map((child: Transaction | string) => {
        if (child instanceof Transaction) {
          return this.preparePayload(child);
        }
        return child;
      });
    }

    return payload;
  }
}
