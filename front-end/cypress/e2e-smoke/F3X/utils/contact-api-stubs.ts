import { ContactFormData } from '../../models/ContactFormModel';
import { ApiUtils } from '../../utils/api';

type LookupStubOptions = {
  query: string;
  contact: ContactFormData;
  alias?: string;
};

export class ContactApiStubs {
  static candidateLookup({ query, contact, alias = 'CandidateLookup' }: LookupStubOptions) {
    return cy
      .intercept(
        {
          method: 'GET',
          pathname: ApiUtils.apiRoutePathname('/contacts/candidate_lookup/'),
          query: { q: query },
        },
        {
          statusCode: 200,
          body: {
            fec_api_candidates: [],
            fecfile_candidates: [contact],
          },
        },
      )
      .as(alias);
  }

  static committeeLookup({ query, contact, alias = 'CommitteeLookup' }: LookupStubOptions) {
    return cy
      .intercept(
        {
          method: 'GET',
          pathname: ApiUtils.apiRoutePathname('/contacts/committee_lookup/'),
          query: { q: query },
        },
        {
          statusCode: 200,
          body: {
            fec_api_committees: [],
            fecfile_committees: [contact],
          },
        },
      )
      .as(alias);
  }
}
