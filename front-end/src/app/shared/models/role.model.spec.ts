import { getRoleLabel, isCommitteeAdministrator, Roles } from '.';

describe('Role Utility Functions', () => {
  describe('getRoleLabel', () => {
    it('should return the correct label for a given role key', () => {
      expect(getRoleLabel('COMMITTEE_ADMINISTRATOR')).toBe('Committee Administrator');
      expect(getRoleLabel('MANAGER')).toBe('Manager');
    });
  });

  describe('isCommitteeAdministrator', () => {
    it('should return true for COMMITTEE_ADMINISTRATOR', () => {
      expect(isCommitteeAdministrator(Roles.COMMITTEE_ADMINISTRATOR)).toBeTrue();
    });

    it('should return true for MANAGER', () => {
      expect(isCommitteeAdministrator(Roles.MANAGER)).toBeFalse();
    });

    it('should return false for undefined role', () => {
      expect(isCommitteeAdministrator(undefined)).toBeFalse();
    });
  });
});
