import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableListService } from '../interfaces/table-list-service.interface';
import { CommitteeLookupResponse, Contact, IndividualLookupResponse, OrganizationLookupResponse } from '../models/contact.model';
import { ListRestResponse } from '../models/rest-api.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ContactService implements TableListService<Contact> {
  constructor(private apiService: ApiService) { }

  public getTableData(pageNumber = 1, ordering = ''): Observable<ListRestResponse> {
    if (!ordering) {
      ordering = 'name';
    }
    return this.apiService.get<ListRestResponse>(`/contacts/?page=${pageNumber}&ordering=${ordering}`).pipe(
      map((response: ListRestResponse) => {
        response.results = response.results.map((item) => Contact.fromJSON(item));
        return response;
      })
    );
  }

  public get(id: string): Observable<Contact> {
    return this.apiService.get<Contact>(`/contacts/${id}`).pipe(map((response) => Contact.fromJSON(response)));
  }

  public create(contact: Contact): Observable<Contact> {
    const payload = contact.toJson();
    return this.apiService.post<Contact>(`/contacts/`, payload).pipe(map((response) => Contact.fromJSON(response)));
  }

  public update(contact: Contact): Observable<Contact> {
    const payload = contact.toJson();
    return this.apiService
      .put<Contact>(`/contacts/${contact.id}/`, payload)
      .pipe(map((response) => Contact.fromJSON(response)));
  }

  public delete(contact: Contact): Observable<null> {
    return this.apiService.delete<null>(`/contacts/${contact.id}`);
  }

  public committeeLookup(search: string, maxFecResults: number,
    maxFecfileResults: number): Observable<CommitteeLookupResponse> {
    return this.apiService.get<CommitteeLookupResponse>(
      '/contacts/committee_lookup/', {
      q: search,
      max_fec_results: maxFecResults,
      max_fecfile_results: maxFecfileResults
    }).pipe(
      map((response) => CommitteeLookupResponse.fromJSON(response)));
  }

  public individualLookup(search: string,
    maxFecfileResults: number): Observable<IndividualLookupResponse> {
    return this.apiService.get<IndividualLookupResponse>(
      '/contacts/individual_lookup/', {
      q: search,
      max_fecfile_results: maxFecfileResults
    }).pipe(
      map((response) => IndividualLookupResponse.fromJSON(response)));
  }

  public organizationLookup(search: string,
    maxFecfileResults: number): Observable<OrganizationLookupResponse> {
    return this.apiService.get<OrganizationLookupResponse>(
      '/contacts/organization_lookup/', {
      q: search,
      max_fecfile_results: maxFecfileResults
    }).pipe(
      map((response) => OrganizationLookupResponse.fromJSON(response)));
  }

}
