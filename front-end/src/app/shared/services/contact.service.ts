import { inject, Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchema } from 'fecfile-validate';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { TableListService } from '../interfaces/table-list-service.interface';
import { Candidate } from '../models/candidate.model';
import { CommitteeAccount } from '../models/committee-account.model';
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
  private readonly apiService = inject(ApiService);

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

  public async getTableData(pageNumber = 1, ordering = '', params: QueryParams = {}): Promise<ListRestResponse> {
    if (!ordering) {
      ordering = 'name';
    }
    const response = await this.apiService.get<ListRestResponse>(
      `/contacts/?page=${pageNumber}&ordering=${ordering}`,
      params,
    );
    response.results = response.results.map((item) => Contact.fromJSON(item));
    return response;
  }

  public async get(id: string): Promise<Contact> {
    const response = await this.apiService.get<Contact>(`/contacts/${id}/`);
    return Contact.fromJSON(response);
  }

  public async create(contact: Contact): Promise<Contact> {
    const payload = this.preparePayload(contact);
    const response = await this.apiService.post<Contact>(`/contacts/`, payload);
    return Contact.fromJSON(response);
  }

  public async update(updated: Contact): Promise<Contact> {
    const response = await this.apiService.put<Contact>(`/contacts/${updated.id}/`, updated);
    return Contact.fromJSON(response);
  }

  public delete(contact: Contact): Promise<null> {
    return this.apiService.delete<null>(`/contacts/${contact.id}/`);
  }

  /**
   * Gets the candidate details.
   *
   * @return     {Promise}  The candidate details.
   */
  public async getCandidateDetails(candidate_id: string | null): Promise<Candidate> {
    if (!candidate_id) {
      throw new Error('FECfile+: No Candidate Id provided in getCandidateDetails()');
    }
    return this.apiService.get<Candidate>('/contacts/candidate/', { candidate_id });
  }

  /**
   * Gets the commitee account details.
   *
   * @return     {Promise}  The commitee details.
   */
  public async getCommitteeDetails(committee_id: string | null): Promise<CommitteeAccount> {
    if (!committee_id) {
      throw new Error('FECfile+: No Committee Id provided in getCommitteeDetails()');
    }
    return this.apiService.get<CommitteeAccount>(`/contacts/committee/`, { committee_id });
  }

  public async candidateLookup(
    search: string,
    maxFecResults: number,
    maxFecfileResults: number,
    office?: CandidateOfficeType,
    excludeFecIds?: string[],
    excludeIds?: string[],
  ): Promise<CandidateLookupResponse> {
    const response = await this.apiService.get<CandidateLookupResponse>('/contacts/candidate_lookup/', {
      q: search,
      max_fec_results: maxFecResults,
      max_fecfile_results: maxFecfileResults,
      office: office ?? '',
      exclude_fec_ids: excludeFecIds?.join(',') as string,
      exclude_ids: excludeIds?.join(',') as string,
    });
    return CandidateLookupResponse.fromJSON(response);
  }

  public async committeeLookup(
    search: string,
    maxFecResults: number,
    maxFecfileResults: number,
    excludeFecIds?: string[],
    excludeIds?: string[],
  ): Promise<CommitteeLookupResponse> {
    const response = await this.apiService.get<CommitteeLookupResponse>('/contacts/committee_lookup/', {
      q: search,
      max_fec_results: maxFecResults,
      max_fecfile_results: maxFecfileResults,
      exclude_fec_ids: excludeFecIds?.join(',') as string,
      exclude_ids: excludeIds?.join(',') as string,
    });
    return CommitteeLookupResponse.fromJSON(response);
  }

  public async checkFecIdForUniqueness(fecId: string, contactId?: string): Promise<boolean> {
    if (fecId) {
      const matchingContactId = await this.apiService.get<string>(`/contacts/get_contact_id/`, { fec_id: fecId });
      return matchingContactId == '' || matchingContactId == (contactId ?? '');
    }
    return true;
  }

  public getFecIdValidator = (contactId?: string) => {
    return async (control: AbstractControl) => {
      if (!control.dirty) {
        return null;
      }

      const isUnique = await this.checkFecIdForUniqueness(control.value, contactId);
      return isUnique ? null : { fecIdMustBeUnique: true };
    };
  };

  public async individualLookup(
    search: string,
    maxFecfileResults: number,
    excludeIds?: string[],
  ): Promise<IndividualLookupResponse> {
    const response = await this.apiService.get<IndividualLookupResponse>('/contacts/individual_lookup/', {
      q: search,
      max_fecfile_results: maxFecfileResults,
      exclude_ids: excludeIds?.join(',') as string,
    });

    return IndividualLookupResponse.fromJSON(response);
  }

  public async organizationLookup(
    search: string,
    maxFecfileResults: number,
    excludeIds?: string[],
  ): Promise<OrganizationLookupResponse> {
    const response = await this.apiService.get<OrganizationLookupResponse>('/contacts/organization_lookup/', {
      q: search,
      max_fecfile_results: maxFecfileResults,
      exclude_ids: excludeIds?.join(',') as string,
    });
    return OrganizationLookupResponse.fromJSON(response);
  }

  private preparePayload(contact: Contact): Record<string, unknown> {
    return contact.toJson();
  }
}

@Injectable({
  providedIn: 'root',
})
export class DeletedContactService implements TableListService<Contact> {
  private readonly apiService = inject(ApiService);

  public async getTableData(pageNumber = 1, ordering = '', params: QueryParams = {}): Promise<ListRestResponse> {
    if (!ordering) {
      ordering = 'name';
    }
    const response = await this.apiService.get<ListRestResponse>(
      `/contacts-deleted/?page=${pageNumber}&ordering=${ordering}`,
      params,
    );
    response.results = response.results.map(Contact.fromJSON);
    return response;
  }

  public restore(contacts: Contact[]): Promise<string[]> {
    const contactIds = contacts.map((contact) => contact.id);
    return this.apiService.post<string[]>('/contacts-deleted/restore/', contactIds);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async delete(_: Contact): Promise<null> {
    return null;
  }
}
