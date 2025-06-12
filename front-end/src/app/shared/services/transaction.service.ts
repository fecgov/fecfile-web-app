import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ListRestResponse } from '../models/rest-api.model';
import { AggregationGroups, ScheduleTransaction, Transaction } from '../models/transaction.model';
import { getFromJSON } from '../utils/transaction-type.utils';
import { ApiService, QueryParams } from './api.service';
import { CandidateOfficeTypes } from '../models/contact.model';
import { Report } from '../models/report.model';
import { formatDate } from '@angular/common';
import { DateType } from '../components/transaction-type-base/transaction-form.utils';

@Injectable({
  providedIn: 'root',
})
export class TransactionService implements TableListService<Transaction> {
  protected readonly apiService = inject(ApiService);
  tableDataEndpoint = '/transactions';

  public async getTableData(pageNumber = 1, ordering = '', params: QueryParams = {}): Promise<ListRestResponse> {
    if (!ordering) {
      ordering = 'line_label,created';
    }
    if (ordering === '-line_label,created') {
      ordering = '-line_label,-created';
    }

    const response = await this.apiService.get<ListRestResponse>(
      `${this.tableDataEndpoint}/?page=${pageNumber}&ordering=${ordering}`,
      params,
    );
    response.results = response.results.map((item) => getFromJSON(item));
    response.pageNumber = pageNumber;
    return response;
  }

  public async get(id: string): Promise<ScheduleTransaction> {
    const response = await this.apiService.get<ScheduleTransaction>(`/transactions/${id}/`);
    return getFromJSON(response);
  }

  public async getPreviousTransactionForAggregate(
    transaction: Transaction | undefined,
    contact_1_id: string,
    action_date: Date | string,
  ): Promise<Transaction | undefined> {
    const actionDateString: string = action_date === '' ? '' : formatDate(action_date, 'yyyy-MM-dd', 'en-US') || '';
    const transaction_id: string = transaction?.id ?? '';
    const aggregation_group: AggregationGroups | undefined =
      (transaction as ScheduleTransaction)?.aggregation_group ?? AggregationGroups.GENERAL;

    if (transaction && action_date && contact_1_id && aggregation_group) {
      const response = await this.apiService.get<HttpResponse<Transaction>>(
        '/transactions/previous/entity/',
        {
          transaction_id,
          contact_1_id,
          date: actionDateString,
          aggregation_group,
        },
        [HttpStatusCode.NotFound],
      );
      if (response.status === HttpStatusCode.NotFound) {
        return undefined;
      }
      return getFromJSON(response.body);
    }
    return undefined;
  }

  public async getPreviousTransactionForCalendarYTD(
    transaction: Transaction | undefined,
    disbursement_date: DateType,
    dissemination_date: DateType,
    election_code: string | undefined,
    candidate_office: string | undefined,
    candidate_state: string | undefined,
    candidate_district: string | undefined,
  ): Promise<Transaction | undefined> {
    const actionDateString = this.getActionDateString(disbursement_date, dissemination_date);

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

      const response = await this.apiService.get<HttpResponse<Transaction>>(
        '/transactions/previous/election/',
        params,
        [HttpStatusCode.NotFound],
      );
      if (response.status === HttpStatusCode.NotFound) {
        return undefined;
      }
      return getFromJSON(response.body);
    }
    return undefined;
  }

  public async getPreviousTransactionForPayeeCandidate(
    transaction: Transaction | undefined,
    contact2Id: string | undefined,
    expenditure_date: Date | string,
    general_election_year: string | undefined,
  ): Promise<Transaction | undefined> {
    const actionDateString: string =
      expenditure_date === '' ? '' : formatDate(expenditure_date, 'yyyy-MM-dd', 'en-US') || '';

    const transaction_id: string = transaction?.id ?? '';
    const contact_2_id: string = contact2Id ?? '';
    const aggregation_group: AggregationGroups | undefined =
      (transaction as ScheduleTransaction)?.aggregation_group ?? AggregationGroups.GENERAL;

    if (transaction && actionDateString && aggregation_group && general_election_year) {
      const params: { [key: string]: string } = {
        transaction_id,
        contact_2_id,
        date: actionDateString,
        aggregation_group,
        general_election_year,
      };

      const response = await this.apiService.get<HttpResponse<Transaction>>(
        '/transactions/previous/payee-candidate/',
        params,
        [HttpStatusCode.NotFound],
      );
      if (response.status === HttpStatusCode.NotFound) {
        return undefined;
      }
      return getFromJSON(response.body);
    }
    return undefined;
  }

  public async create(transaction: Transaction): Promise<Transaction> {
    const payload = this.preparePayload(transaction);
    const id = await this.apiService.post<string>(`${transaction.transactionType.apiEndpoint}/`, payload);

    transaction.id = id;
    return transaction;
  }

  public async update(transaction: Transaction): Promise<Transaction> {
    const payload = this.preparePayload(transaction);
    await this.apiService.put<string>(`${transaction.transactionType?.apiEndpoint}/${transaction.id}/`, payload, {});

    return transaction;
  }

  public delete(transaction: Transaction): Promise<null> {
    return this.apiService.delete<null>(`${transaction.transactionType?.apiEndpoint}/${transaction.id}/`);
  }

  public async multiSaveReattRedes(transactions: Transaction[]): Promise<Transaction[]> {
    const payload = transactions.map((t) => this.preparePayload(t));
    const ids = await this.apiService.put<string[]>(
      `${transactions[0].transactionType?.apiEndpoint}/multisave/reattribution/`,
      payload,
      {},
    );

    transactions.forEach((t, i) => (t.id = ids[i]));
    return transactions;
  }

  public addToReport(transaction: Transaction, report: Report): Promise<HttpResponse<string>> {
    const payload = {
      report_id: report.id,
      transaction_id: transaction.id,
    };
    return this.apiService.post<string>(`${transaction.transactionType?.apiEndpoint}/add-to-report/`, payload, {}, [
      HttpStatusCode.Accepted,
      HttpStatusCode.NotFound,
      HttpStatusCode.BadRequest,
    ]);
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

  private getActionDateString(
    disbursement_date: string | Date | undefined,
    dissemination_date: string | Date | undefined,
  ): string {
    let actionDateString: string = '';
    if (disbursement_date !== '')
      actionDateString = disbursement_date ? formatDate(disbursement_date, 'yyyy-MM-dd', 'en-US') : '';
    if (actionDateString.length === 0 && dissemination_date !== '') {
      actionDateString = dissemination_date ? formatDate(dissemination_date, 'yyyy-MM-dd', 'en-US') : '';
    }
    return actionDateString;
  }
}
