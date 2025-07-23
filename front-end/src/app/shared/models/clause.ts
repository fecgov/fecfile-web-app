export function conduitClause(conduit: string | undefined, forFrom: 'from' | 'for'): string {
  if (conduit) {
    const conduitClause = `Earmarked ${forFrom} ${conduit}`;
    return shortenClause(conduitClause);
  }
  return '';
}

export function shortenClause(clause: string, parenthetical = '') {
  if ((clause + parenthetical).length > 100) {
    clause = clause.slice(0, 97 - parenthetical.length) + '...';
  }
  return clause + parenthetical;
}
