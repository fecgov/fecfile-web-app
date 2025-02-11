export enum Roles {
  COMMITTEE_ADMINISTRATOR = 'Committee Administrator',
  REVIEWER = 'Reviewer',
  MANAGER = 'Manager',
}

export function getRoleLabel(roleKey: keyof typeof Roles): string {
  return Roles[roleKey];
}

export function isManagerAdmin(role: Roles | undefined): boolean {
  if (!role) return false;
  return [Roles.COMMITTEE_ADMINISTRATOR, Roles.MANAGER].includes(role);
}
