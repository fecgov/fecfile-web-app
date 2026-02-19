const aliasEventStack: string[] = [];

function toTitleCaseToken(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function normalizeAliasEvent(label: string): string {
  const normalized = label.trim().replaceAll(/[^a-zA-Z0-9]+/g, ' ');
  if (!normalized) return 'UnknownEvent';

  return normalized
    .split(/\s+/)
    .filter(Boolean)
    .map(toTitleCaseToken)
    .join('');
}

export function pushAliasEvent(label: string): string {
  const normalized = normalizeAliasEvent(label);
  aliasEventStack.push(normalized);
  return normalized;
}

export function popAliasEvent(): void {
  if (aliasEventStack.length > 0) {
    aliasEventStack.pop();
  }
}

export function getActiveAliasEvent(): string | undefined {
  return aliasEventStack.at(-1);
}
