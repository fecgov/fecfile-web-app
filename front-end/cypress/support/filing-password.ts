const DEFAULT_FILING_PASSWORD = 'make-it-up';
export function normalizeFilingPassword(value: unknown): string {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return DEFAULT_FILING_PASSWORD;
}

export function getNormalizedFilingPassword() {
  return cy
    .env<{ FILING_PASSWORD?: unknown }>(['FILING_PASSWORD'])
    .then(({ FILING_PASSWORD }) => normalizeFilingPassword(FILING_PASSWORD));
}
