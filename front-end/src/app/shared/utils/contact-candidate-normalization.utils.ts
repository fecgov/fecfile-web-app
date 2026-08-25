export function normalizeCandidateState(state?: string): string | undefined {
  if (!state || state === 'US') return undefined;
  return state;
}

export function normalizeCandidateDistrict(state?: string, office?: string, district?: string): string | undefined {
  if (!district || state === 'US' || office === 'S') return undefined;
  return district;
}