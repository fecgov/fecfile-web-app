import { CommitteeAccount } from "./committee-account.model";

export type FecApiPagination = {
    page: number;
    per_page: number;
    count: number;
    pages: number;
}

export type FecApiPaginatedResponse = {
    api_version: string;
    pagination: FecApiPagination
    results: CommitteeAccount[];
};
