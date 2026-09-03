import { inject, Injectable } from '@angular/core';
import { ElectionCycle } from './election-cycle.model';
import { TableListService } from 'app/shared/interfaces/table-list-service.interface';
import { ListRestResponse } from 'app/shared/models';
import { ApiService, QueryParams } from 'app/shared/services/api.service';

@Injectable()
export class ElectionCycleService implements TableListService<ElectionCycle> {
  private readonly apiService = inject(ApiService);
  private readonly endpoint = '/election-cycles/';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getTableData(pageNumber = 1, ordering = '', params: QueryParams = {}): Promise<ListRestResponse> {
    return { count: 0, next: '', previous: '', pageNumber, results: [] };
  }

  async delete(item: ElectionCycle): Promise<null> {
    return this.apiService.delete<null>(`${this.endpoint}${item.id}`);
  }
}
