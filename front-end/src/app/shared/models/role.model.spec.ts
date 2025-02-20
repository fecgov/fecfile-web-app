import { getRoleLabel, isManagerAdmin, Roles } from '.';

describe('Role Utility Functions', () => {
  describe('getRoleLabel', () => {
    it('should return the correct label for a given role key', () => {
      expect(getRoleLabel('COMMITTEE_ADMINISTRATOR')).toBe('Committee Administrator');
      expect(getRoleLabel('MANAGER')).toBe('Manager');
    });
  });

  describe('isManagerAdmin', () => {
    it('should return true for COMMITTEE_ADMINISTRATOR', () => {
      expect(isManagerAdmin(Roles.COMMITTEE_ADMINISTRATOR)).toBeTrue();
    });

    it('should return true for MANAGER', () => {
      expect(isManagerAdmin(Roles.MANAGER)).toBeTrue();
    });

    it('should return false for undefined role', () => {
      expect(isManagerAdmin(undefined)).toBeFalse();
    });
  });
});
