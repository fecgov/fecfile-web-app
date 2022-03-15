import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableListService } from '../services/table-list-service.interface';
import { ListRestResponse } from '../models/rest-api.model';
import { ApiService } from './api.service';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService implements TableListService<Contact> {
  constructor(private apiService: ApiService) {}

  public getTableData(pageNumber: number = 1): Observable<ListRestResponse> {
    return this.apiService.spinnerGet<ListRestResponse>(`/contacts/?page=${pageNumber}`).pipe(
      map((response: ListRestResponse) => {
        response.results = response.results.map((item: any) => Contact.fromJSON(item));
        return response;
      })
    );
  }

  public create(contact: Contact): Observable<any> {
    const payload: any = contact.toJson();
    return this.apiService.post<any>(`/contacts/${contact.id}/`, payload);
  }

  public update(contact: Contact): Observable<any> {
    const payload: any = contact.toJson();
    return this.apiService.put<any>(`/contacts/${contact.id}/`, payload);
  }

  public delete(contact: Contact): Observable<null> {
    return this.apiService.delete<null>(`/contacts/${contact.id}`);
  }
}
