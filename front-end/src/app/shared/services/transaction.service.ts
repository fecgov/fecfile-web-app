import { DatePipe } from '@angular/common';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ListRestResponse } from '../models/rest-api.model';
import { AggregationGroups, ScheduleTransaction, Transaction } from '../models/transaction.model';
import { getFromJSON } from '../utils/transaction-type.utils';
import { ApiService } from './api.service';
import { CandidateOfficeTypes } from '../models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService implements TableListService<Transaction> {
  tableDataEndpoint = '/transactions';

  constructor(protected apiService: ApiService, protected datePipe: DatePipe) {}

  public getTableData(
    pageNumber = 1,
    ordering = '',
    params: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> } = {}
  ): Observable<ListRestResponse> {
    if (!ordering) {
      ordering = 'line_label_order_key';
    }
    return this.apiService
      .get<ListRestResponse>(`${this.tableDataEndpoint}/?page=${pageNumber}&ordering=${ordering}`, params)
      .pipe(
        map((response: ListRestResponse) => {
          response.results = response.results.map((item) => getFromJSON(item));
          response.pageNumber = pageNumber;
          return response;
        })
      );
  }

  public get(id: string): Observable<ScheduleTransaction> {
    return this.apiService.get<ScheduleTransaction>(`/transactions/${id}/`).pipe(
      map((response) => {
        return getFromJSON(response);
      })
    );
  }

  public getPreviousTransactionForAggregate(
    transaction: Transaction | undefined,
    contact_1_id: string,
    action_date: Date
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
          [HttpStatusCode.NotFound]
        )
        .pipe(
          map((response) => {
            if (response.status === HttpStatusCode.NotFound) {
              return undefined;
            }
            return getFromJSON(response.body);
          })
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
    candidate_district: string | undefined
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
          })
        );
    }
    return of(undefined);
  }

  public create(transaction: Transaction): Observable<Transaction> {
    console.log(transaction.transactionType.apiEndpoint);
    const payload = this.preparePayload(transaction);
    console.log(transaction.transactionType.apiEndpoint);
    return this.apiService
      .post<Transaction>(`${transaction.transactionType.apiEndpoint}/`, payload)
      .pipe(map((response) => getFromJSON(response)));
  }

  public update(transaction: Transaction): Observable<Transaction> {
    const payload = this.preparePayload(transaction);
    return this.apiService
      .put<Transaction>(`${transaction.transactionType?.apiEndpoint}/${transaction.id}/`, payload)
      .pipe(map((response) => getFromJSON(response)));
  }

  public delete(transaction: Transaction): Observable<null> {
    return this.apiService.delete<null>(`${transaction.transactionType?.apiEndpoint}/${transaction.id}`).pipe(
      tap(() => {
        if (transaction.transactionType?.updateParentOnSave && transaction.parent_transaction?.children) {
          // Remove deleted transaction from parent's list of children
          transaction.parent_transaction.children = transaction.parent_transaction.children.filter(
            (child) => child.id !== transaction.id
          );
          const parentTransactionPayload = transaction.getUpdatedParent(true);
          this.update(parentTransactionPayload).subscribe();
        }
      })
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
    if (typeof transaction === 'string') return transaction;
    const payload = transaction.toJson();

    // Add flags to the payload used for API processing
    if (transaction.transactionType?.scheduleId) {
      payload['schedule_id'] = transaction.transactionType.scheduleId;
    }
    if (transaction.transactionType?.getUseParentContact(transaction)) {
      payload['use_parent_contact'] = transaction.transactionType.getUseParentContact(transaction);
    }

    delete payload['transactionType'];
    delete payload['report'];

    if (transaction.children) {
      payload['children'] = transaction.children.map((transaction) => this.preparePayload(transaction));
    }

    return payload;
  }
}
