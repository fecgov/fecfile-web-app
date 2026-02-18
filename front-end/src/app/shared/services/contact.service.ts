import { inject, Injectable, signal } from '@angular/core';
import type { AbstractControl } from '@angular/forms';
import type { JsonSchema } from 'fecfile-validate';
import type { TableListService } from '../interfaces/table-list-service.interface';
import type { Candidate } from '../models/candidate.model';
import type { CommitteeAccount } from '../models/committee-account.model';
import type { CandidateOfficeType } from '../models/contact.model';
import {
  IndividualLookupResponse,
  OrganizationLookupResponse,
  CandidateLookupResponse,
  CommitteeLookupResponse,
  Contact,
  ContactTypes,
} from '../models/contact.model';
import type { ListRestResponse } from '../models/rest-api.model';
import { ApiService, QueryParams } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ContactService implements TableListService<Contact> {
  private readonly apiService = inject(ApiService);

  readonly maxFecResults = signal(10);
  readonly maxFecfileResults = signal(5);

  /**
   * Given the type of contact given, return the appropriate JSON schema doc
   * @param {ContactTypes} type
   * @returns {JsonSchema} schema
   */
  public static async getSchemaByType(type: ContactTypes): Promise<JsonSchema> {
    switch (type) {
      case ContactTypes.CANDIDATE: {
        const { schema } = await import('fecfile-validate/fecfile_validate_js/dist/Contact_Candidate');
        return schema;
      }
      case ContactTypes.COMMITTEE: {
        const { schema } = await import('fecfile-validate/fecfile_validate_js/dist/Contact_Committee');
        return schema;
      }
      case ContactTypes.ORGANIZATION: {
        const { schema } = await import('fecfile-validate/fecfile_validate_js/dist/Contact_Individual');
        return schema;
      }
      case ContactTypes.INDIVIDUAL: {
        const { schema } = await import('fecfile-validate/fecfile_validate_js/dist/Contact_Organization');
        return schema;
      }
    }
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
    exclude_fec_ids: string,
    exclude_ids: string,
    office?: CandidateOfficeType,
  ): Promise<CandidateLookupResponse> {
    const response = await this.apiService.get<CandidateLookupResponse>('/contacts/candidate_lookup/', {
      q: search,
      max_fec_results: this.maxFecResults(),
      max_fecfile_results: this.maxFecfileResults(),
      office: office ?? '',
      exclude_fec_ids,
      exclude_ids,
    });
    return CandidateLookupResponse.fromJSON(response);
  }

  public async committeeLookup(
    search: string,
    exclude_fec_ids: string,
    exclude_ids: string,
  ): Promise<CommitteeLookupResponse> {
    const response = await this.apiService.get<CommitteeLookupResponse>('/contacts/committee_lookup/', {
      q: search,
      max_fec_results: this.maxFecResults(),
      max_fecfile_results: this.maxFecfileResults(),
      exclude_fec_ids,
      exclude_ids,
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

  public async individualLookup(search: string, exclude_ids: string): Promise<IndividualLookupResponse> {
    const response = await this.apiService.get<IndividualLookupResponse>('/contacts/individual_lookup/', {
      q: search,
      max_fecfile_results: this.maxFecfileResults(),
      exclude_ids,
    });

    return IndividualLookupResponse.fromJSON(response);
  }

  public async organizationLookup(search: string, exclude_ids: string): Promise<OrganizationLookupResponse> {
    const response = await this.apiService.get<OrganizationLookupResponse>('/contacts/organization_lookup/', {
      q: search,
      max_fecfile_results: this.maxFecfileResults(),
      exclude_ids,
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
