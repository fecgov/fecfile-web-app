import { inject, Injectable, Resource, ResourceStatus, signal } from '@angular/core';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ApiService, QueryParams } from './api.service';
import { ListRestResponse } from '../models';
import { CommitteeManagementEvent } from '../models/committee-management-event.model';

@Injectable({
  providedIn: 'root',
})
export class CommitteeManagementEventService implements TableListService<CommitteeManagementEvent> {
  private readonly apiService = inject(ApiService);
  private readonly endpoint = '/committee-management-events/';

  public readonly committeeManagementEventsSignal = signal<CommitteeManagementEvent[]>([]);

  public async getTableData(pageNumber = 1, ordering = '', params: QueryParams = {}): Promise<ListRestResponse> {
    let parameter_string = `?page=${pageNumber}`;
    if (ordering?.length > 0) {
      parameter_string += `&ordering=${ordering}`;
    }
    const response = await this.apiService.get<ListRestResponse>(`${this.endpoint}${parameter_string}`, params);
    response.results = response.results.map((item) => CommitteeManagementEvent.fromJSON(item));
    return response;
  }

  public async getManagementEvents(): Promise<CommitteeManagementEvent[]> {
    const response = await this.apiService.get<Array<CommitteeManagementEvent>>(this.endpoint);
    const committeeManagementEvents = response.map((item) => CommitteeManagementEvent.fromJSON(item));
    this.committeeManagementEventsSignal.set(committeeManagementEvents);
    return committeeManagementEvents;
  }

  async waitForResource<T>(resource: Resource<T>): Promise<void> {
    resource.reload();
    while (resource.status() === ResourceStatus.Reloading) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(item: CommitteeManagementEvent): Promise<null> {
    throw new Error('Cannot delete CommitteeManagementEvents');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update?(item: CommitteeManagementEvent, fieldsToValidate?: string[]): Promise<CommitteeManagementEvent> {
    throw new Error('Cannot update CommitteeManagementEvents');
  }
}
