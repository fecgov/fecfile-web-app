import { Candidate } from './candidate.model';
import { CommitteeAccount } from './committee-account.model';
import { FecFiling } from './fec-filing.model';

export type FecApiPagination = {
  page: number;
  per_page: number;
  count: number;
  pages: number;
};

export type FecApiPaginatedResponse = {
  api_version: string;
  pagination: FecApiPagination;
  results: Candidate[] | CommitteeAccount[] | FecFiling[];
};
