export enum Roles {
  COMMITTEE_ADMINISTRATOR = 'Committee Administrator',
  MANAGER = 'Manager',
}

export function getRoleKey(role: Roles): typeof Roles {
  return Object.keys(Roles).find((key) => Roles[key as keyof typeof Roles] === role) as unknown as typeof Roles;
}

export function getRoleLabel(roleKey: keyof typeof Roles): string {
  return Roles[roleKey];
}

export function isCommitteeAdministrator(role: Roles | undefined): boolean {
  if (!role) return false;
  return [Roles.COMMITTEE_ADMINISTRATOR].includes(role);
}
