import { inject, Injectable } from '@angular/core';
import { Coverage, ElectionCycle } from './election-cycle.model';
import { TableListService } from 'app/shared/interfaces/table-list-service.interface';
import { ListRestResponse } from 'app/shared/models';
import { ApiService } from 'app/shared/services/api.service';
import { DateUtils } from 'app/shared/utils/date.utils';

export interface ElectionCycleCoverageLookupResponse {
  needsCycle: boolean;
  needsNextCycle: boolean;
  electionCycle: ElectionCycle | null;
  nextElectionCycle: ElectionCycle | null;
}

interface ElectionCycleCoverageLookupApiResponse {
  needs_cycle: boolean;
  needs_next_cycle: boolean;
  election_cycle?: Record<string, unknown>;
  next_election_cycle?: Record<string, unknown>;
}

@Injectable()
export class ElectionCycleService implements TableListService<ElectionCycle> {
  private readonly apiService = inject(ApiService);
  private readonly endpoint = '/election-cycles/';

  public async getTableData(params = {}): Promise<ListRestResponse> {
    params = { page: 1, ordering: '-election_year,-start_date', ...params };
    const response = await this.apiService.get<ListRestResponse>(`/election-cycles/`, params);
    response.results = response.results.map((item) => ElectionCycle.fromJson(item));
    return response;
  }

  async delete(item: ElectionCycle): Promise<null> {
    return this.apiService.delete<null>(`${this.endpoint}${item.id}/`);
  }

  async create(cycle: ElectionCycle): Promise<ElectionCycle> {
    const payload = cycle.toJson();
    const response = await this.apiService.post<Record<string, string>>(this.endpoint, payload);
    return ElectionCycle.fromJson(response);
  }

  async update(cycle: ElectionCycle): Promise<ElectionCycle> {
    const payload = cycle.toJson();
    const response = await this.apiService.put<Record<string, string>>(`${this.endpoint}${cycle.id}/`, payload);
    return ElectionCycle.fromJson(response);
  }

  async findByCoverage(coverage: Coverage): Promise<ElectionCycleCoverageLookupResponse> {
    const response = await this.apiService.get<ElectionCycleCoverageLookupApiResponse>(
      `${this.endpoint}find-by-coverage/`,
      {
        start_date: DateUtils.convertDateToFecFormat(coverage.startDate),
        end_date: DateUtils.convertDateToFecFormat(coverage.endDate),
      },
    );
    return {
      needsCycle: response.needs_cycle,
      needsNextCycle: response.needs_next_cycle,
      electionCycle: response.election_cycle ? ElectionCycle.fromJson(response.election_cycle) : null,
      nextElectionCycle: response.next_election_cycle ? ElectionCycle.fromJson(response.next_election_cycle) : null,
    };
  }
}
