type DataCyPart = string | number | null | undefined | false;

export function slugifyDataCyPart(part: DataCyPart): string {
  if (part === null || part === undefined || part === false) return '';

  return String(part)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
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
