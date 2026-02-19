function withSource(baseAlias: string, source?: string): string {
  if (!source) return baseAlias;
  const normalizedSource = source.trim().replace(/[^a-zA-Z0-9_-]+/g, '_');
  return normalizedSource ? `${baseAlias}__${normalizedSource}` : baseAlias;
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
