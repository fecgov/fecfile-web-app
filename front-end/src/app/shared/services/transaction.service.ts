import { formatDate } from '@angular/common';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DateType } from '../components/transaction-type-base/transaction-form.utils';
import { CandidateOfficeTypes } from '../models/contact.model';
import { AggregationGroups, ScheduleTransaction, Transaction } from '../models/transaction.model';
import { getFromJSON } from '../utils/transaction-type.utils';
import { ApiService } from './api.service';

interface PreviousAggregate {
  aggregate: number;
  calendar_ytd_per_election_office: number;
  aggregate_general_elec_expended: number;
}

type PreviousAggregateField = keyof Pick<
  PreviousAggregate,
  'aggregate' | 'calendar_ytd_per_election_office' | 'aggregate_general_elec_expended'
>;

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  protected readonly apiService = inject(ApiService);
  tableDataEndpoint = '/transactions';

  public get = async (id: string): Promise<ScheduleTransaction> => {
    const response = await this.apiService.get<ScheduleTransaction>(`/transactions/${id}/`);
    return getFromJSON(response);
  };

  public async getPreviousEntityAggregate(
    transaction: Transaction,
    contact_1_id: string,
    action_date: Date | string,
  ): Promise<number | null> {
    const date = action_date ? formatDate(action_date, 'yyyy-MM-dd', 'en-US') : '';

    return this.fetchPreviousAggregate(
      transaction,
      '/transactions/previous/entity/',
      { contact_1_id, date },
      'aggregate',
      !!contact_1_id,
    );
  }

  public async getPreviousElectionAggregate(
    transaction: Transaction | undefined,
    disbursement_date: DateType,
    dissemination_date: DateType,
    election_code: string | undefined,
    candidate_office: string | undefined,
    candidate_state: string | undefined,
    candidate_district: string | undefined,
  ): Promise<number | null> {
    const date = this.getActionDateString(disbursement_date, dissemination_date);
    const hasRequiredState = !!(candidate_state || candidate_office === CandidateOfficeTypes.PRESIDENTIAL);
    const hasRequiredDistrict = !!(candidate_district || candidate_office !== CandidateOfficeTypes.HOUSE);
    const isValid = !!(candidate_office && election_code && hasRequiredState && hasRequiredDistrict);

    return this.fetchPreviousAggregate(
      transaction,
      '/transactions/previous/election/',
      { date, election_code, candidate_office, candidate_state, candidate_district },
      'calendar_ytd_per_election_office',
      isValid,
    );
  }

  public async getPreviousPayeeCandidateAggregate(
    transaction: Transaction | undefined,
    contact2Id: string | undefined,
    expenditure_date: Date | string,
    general_election_year: string | undefined,
  ): Promise<number | null> {
    const date = expenditure_date ? formatDate(expenditure_date, 'yyyy-MM-dd', 'en-US') : '';
    const contact_2_id = contact2Id ?? '';

    return this.fetchPreviousAggregate(
      transaction,
      '/transactions/previous/payee-candidate/',
      { contact_2_id, date, general_election_year },
      'aggregate_general_elec_expended',
      !!(contact_2_id && general_election_year),
    );
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

  private async fetchPreviousAggregate(
    transaction: Transaction | undefined,
    endpoint: string,
    params: Record<string, string | undefined>,
    resultField: PreviousAggregateField,
    validationCondition: boolean,
  ): Promise<number | null> {
    const transaction_id = transaction?.id ?? '';
    const aggregation_group = (transaction as ScheduleTransaction)?.aggregation_group ?? AggregationGroups.GENERAL;

    if (!transaction || !aggregation_group || !params['date'] || !validationCondition) {
      return null;
    }

    const response = await this.apiService.get<HttpResponse<PreviousAggregate>>(
      endpoint,
      { transaction_id, aggregation_group, ...params },
      [HttpStatusCode.NotFound],
    );

    return response.body?.[resultField] ?? null;
  }
}
