import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { lastValueFrom, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { JsonSchema } from '../interfaces/json-schema.interface';
import { TableListService } from '../interfaces/table-list-service.interface';
import {
  CandidateLookupResponse,
  CandidateOfficeType,
  CommitteeLookupResponse,
  Contact,
  ContactTypes,
  IndividualLookupResponse,
  OrganizationLookupResponse,
} from '../models/contact.model';
import { ListRestResponse } from '../models/rest-api.model';
import { ApiService, QueryParams } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ContactService implements TableListService<Contact> {
  constructor(private apiService: ApiService) {}

  /**
   * Given the type of contact given, return the appropriate JSON schema doc
   * @param {ContactTypes} type
   * @returns {JsonSchema} schema
   */
  public static getSchemaByType(type: ContactTypes): JsonSchema {
    let schema: JsonSchema = contactIndividualSchema;
    if (type === ContactTypes.CANDIDATE) {
      schema = contactCandidateSchema;
    }
    if (type === ContactTypes.COMMITTEE) {
      schema = contactCommitteeSchema;
    }
    if (type === ContactTypes.ORGANIZATION) {
      schema = contactOrganizationSchema;
    }
    return schema;
  }

  public getTableData(pageNumber = 1, ordering = '', params: QueryParams = {}): Observable<ListRestResponse> {
    if (!ordering) {
      ordering = 'name';
    }
    return this.apiService.get<ListRestResponse>(`/contacts/?page=${pageNumber}&ordering=${ordering}`, params).pipe(
      map((response: ListRestResponse) => {
        response.results = response.results.map((item) => Contact.fromJSON(item));
        return response;
      }),
    );
  }

  public get(id: string): Observable<Contact> {
    return this.apiService.get<Contact>(`/contacts/${id}`).pipe(map((response) => Contact.fromJSON(response)));
  }

  public create(contact: Contact): Observable<Contact> {
    const payload = this.preparePayload(contact);
    return this.apiService.post<Contact>(`/contacts/`, payload).pipe(map((response) => Contact.fromJSON(response)));
  }

  public update(updated: Contact): Observable<Contact> {
    return this.apiService
      .put<Contact>(`/contacts/${updated.id}/`, updated)
      .pipe(map((response) => Contact.fromJSON(response)));
  }

  public delete(contact: Contact): Observable<null> {
    return this.apiService.delete<null>(`/contacts/${contact.id}`);
  }

  public async candidateLookup(
    search: string,
    maxFecResults: number,
    maxFecfileResults: number,
    office?: CandidateOfficeType,
    excludeFecIds?: string[],
    excludeIds?: string[],
  ): Promise<CandidateLookupResponse> {
    const response = await lastValueFrom(
      this.apiService.get<CandidateLookupResponse>('/contacts/candidate_lookup/', {
        q: search,
        max_fec_results: maxFecResults,
        max_fecfile_results: maxFecfileResults,
        office: office ?? '',
        exclude_fec_ids: excludeFecIds?.join(',') as string,
        exclude_ids: excludeIds?.join(',') as string,
      }),
    );
    return CandidateLookupResponse.fromJSON(response);
  }

  public committeeLookup(
    search: string,
    maxFecResults: number,
    maxFecfileResults: number,
    excludeFecIds?: string[],
    excludeIds?: string[],
  ): Observable<CommitteeLookupResponse> {
    return this.apiService
      .get<CommitteeLookupResponse>('/contacts/committee_lookup/', {
        q: search,
        max_fec_results: maxFecResults,
        max_fecfile_results: maxFecfileResults,
        exclude_fec_ids: excludeFecIds?.join(',') as string,
        exclude_ids: excludeIds?.join(',') as string,
      })
      .pipe(map((response) => CommitteeLookupResponse.fromJSON(response)));
  }

  public checkFecIdForUniqueness(fecId: string, contactId?: string): Observable<boolean> {
    if (fecId) {
      return this.apiService
        .get<string>(`/contacts/get_contact_id/`, { fec_id: fecId })
        .pipe(map((matchingContactId) => matchingContactId == '' || matchingContactId == (contactId ?? '')));
    }
    return of(true);
  }

  public getFecIdValidator = (contactId?: string) => {
    return (control: AbstractControl) => {
      if (!control.dirty) {
        return of(null);
      }
      return of(control.value).pipe(
        switchMap((fecId) =>
          this.checkFecIdForUniqueness(fecId, contactId).pipe(
            map((isUnique: boolean) => {
              return isUnique ? null : { fecIdMustBeUnique: true };
            }),
          ),
        ),
      );
    };
  };

  public individualLookup(
    search: string,
    maxFecfileResults: number,
    excludeIds?: string[],
  ): Observable<IndividualLookupResponse> {
    return this.apiService
      .get<IndividualLookupResponse>('/contacts/individual_lookup/', {
        q: search,
        max_fecfile_results: maxFecfileResults,
        exclude_ids: excludeIds?.join(',') as string,
      })
      .pipe(map((response) => IndividualLookupResponse.fromJSON(response)));
  }

  public organizationLookup(
    search: string,
    maxFecfileResults: number,
    excludeIds?: string[],
  ): Observable<OrganizationLookupResponse> {
    return this.apiService
      .get<OrganizationLookupResponse>('/contacts/organization_lookup/', {
        q: search,
        max_fecfile_results: maxFecfileResults,
        exclude_ids: excludeIds?.join(',') as string,
      })
      .pipe(map((response) => OrganizationLookupResponse.fromJSON(response)));
  }

  private preparePayload(contact: Contact): Record<string, unknown> {
    return contact.toJson();
  }
}

@Injectable({
  providedIn: 'root',
})
export class DeletedContactService implements TableListService<Contact> {
  constructor(private apiService: ApiService) {}

  public getTableData(pageNumber = 1, ordering = '', params: QueryParams = {}): Observable<ListRestResponse> {
    if (!ordering) {
      ordering = 'name';
    }
    return this.apiService
      .get<ListRestResponse>(`/contacts-deleted/?page=${pageNumber}&ordering=${ordering}`, params)
      .pipe(
        map((response: ListRestResponse) => {
          response.results = response.results.map(Contact.fromJSON);
          return response;
        }),
      );
  }

  public restore(contacts: Contact[]): Observable<string[]> {
    const contactIds = contacts.map((contact) => contact.id);
    return this.apiService.post<string[]>('/contacts-deleted/restore/', contactIds);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public delete(_: Contact): Observable<null> {
    return of(null);
  }
}
