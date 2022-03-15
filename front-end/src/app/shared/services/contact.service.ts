import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListRestResponse } from '../models/rest-api.model';
import { ApiService } from './api.service';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private apiService: ApiService) {}

  public getTableData(pageNumber: number = 1): Observable<ListRestResponse> {
    return this.apiService.spinnerGet<ListRestResponse>(`/contacts/?page=${pageNumber}`).pipe(
      map((response: ListRestResponse) => {
        response.results = response.results.map((item: any) => Contact.fromJSON(item));
        return response;
      })
    );
  }

  public delete(contact: Contact) {
    return this.apiService.delete<Contact>(`/contacts/${contact.id}`);
  }
}
