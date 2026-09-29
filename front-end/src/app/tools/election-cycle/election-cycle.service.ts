import { inject, Injectable } from '@angular/core';
import { ElectionCycle } from './election-cycle.model';
import { TableListService } from 'app/shared/interfaces/table-list-service.interface';
import { ListRestResponse } from 'app/shared/models';
import { ApiService } from 'app/shared/services/api.service';

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
    return this.apiService.delete<null>(`${this.endpoint}${item.id}`);
  }

  async create(cycle: ElectionCycle): Promise<ElectionCycle> {
    const payload = cycle.toJson();
    const response = await this.apiService.post<Record<string, string>>(this.endpoint, payload);
    return ElectionCycle.fromJson(response);
  }
}
