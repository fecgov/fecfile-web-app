type DataCyPart = string | number | null | undefined | false;

export function slugifyDataCyPart(part: DataCyPart): string {
  if (part === null || part === undefined || part === false) return '';

  return String(part)
    .trim()
    .replaceAll(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replaceAll(/[^a-zA-Z0-9]+/g, '-')
    .replaceAll(/-{2,}/g, '-')
    .replaceAll(/^-|-$/g, '')
    .toLowerCase();
}

export function buildDataCy(...parts: DataCyPart[]): string {
  return parts
    .map((part) => slugifyDataCyPart(part))
    .filter(Boolean)
    .join('-');
}

export function dataCySelector(dataCy: string): string {
  return `[data-cy="${dataCy}"]`;
}
