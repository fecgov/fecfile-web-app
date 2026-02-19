import { getActiveAliasEvent } from '../../support/alias-event-context';

function normalizeAliasToken(value: string): string {
  return value.trim().replaceAll(/[^a-zA-Z0-9_-]+/g, '_');
}

function withSource(baseAlias: string, source?: string): string {
  const parts: string[] = [];

  if (source) {
    const normalizedSource = normalizeAliasToken(source);
    if (normalizedSource) parts.push(normalizedSource);
  }

  const activeEvent = getActiveAliasEvent();
  if (activeEvent) {
    const normalizedEvent = normalizeAliasToken(activeEvent);
    if (normalizedEvent) parts.push(normalizedEvent);
  }

  if (parts.length < 1) return baseAlias;
  return `${baseAlias}__${parts.join('_')}`;
}

export const SmokeAliases = {
  network: {
    named: (alias: string, source?: string) => withSource(alias, source),
  },
  reviewReport: {
    getReport: (visitNumber: number, source?: string) =>
      withSource(`getReport-${visitNumber}`, source),
  },
  reportList: {
    reports: (source?: string) => withSource('GetReports', source),
    receipts: (source?: string) => withSource('GetReceipts', source),
    loans: (source?: string) => withSource('GetLoans', source),
    disbursements: (source?: string) => withSource('GetDisbursements', source),
  },
  transactionDetail: {
    saveParentLoan: (source?: string) => withSource('SaveParentLoan', source),
    saveGuarantor: (source?: string) => withSource('SaveGuarantor', source),
    getGuarantors: (source?: string) => withSource('GetGuarantors', source),
  },
  transactionListNavigation: {
    listRefresh: (source?: string) => withSource('GetTransactionsListRefresh', source),
  },
} as const;
