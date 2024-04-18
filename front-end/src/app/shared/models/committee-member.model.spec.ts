import { isPAC, isPTY } from './committee-account.model';
import { CommitteeMember } from './committee-member.model';

describe('CommitteeMember', () => {
  it('should create an instance', () => {
    expect(new CommitteeMember()).toBeTruthy();
  });

  it('should be created correctly from JSON', () => {
    const json = {
      role: 'COMMITTEE_ADMINISTRATOR',
      first_name: 'test',
      last_name: 'testson',
      email: 'test@test.com',
      is_active: true,
    };
    const member = CommitteeMember.fromJSON(json);
    expect(member.first_name).toBe(json['first_name']);
    expect(member.last_name).toBe(json['last_name']);
    expect(member.email).toBe(json['email']);
    expect(member.role).toBe(json['role']);
    expect(member.is_active).toBe(json['is_active']);
  });

  it('should return the correct role label when role is not null', () => {
    const member = new CommitteeMember();
    member.role = 'COMMITTEE_ADMINISTRATOR';
    expect(member.getRoleLabel()).toBe('Committee Administrator');
  });

  it('should return an empty string for a role label if role is null', () => {
    expect(new CommitteeMember().getRoleLabel()).toBe('');
  });

  it('should return an empty string for a label if the role is not present in the LabelList', () => {
    const cUser = new CommitteeMember();
    cUser.role = "This Isn't a Real Role";
    expect(cUser.getRoleLabel()).toBe('');
  });

  it('should confirm if committee is PAC', () => {
    expect(isPAC()).toBeFalse();
    const PAC = ['O', 'U', 'D', 'N', 'Q', 'V', 'W'];
    PAC.forEach((entry) => {
      expect(isPAC(entry)).toBeTrue();
    });
    expect(isPAC('X')).toBeFalse();
  });

  it('should confirm if committee is PTY', () => {
    expect(isPTY()).toBeFalse();
    const PTY = ['X', 'Y'];
    PTY.forEach((entry) => {
      expect(isPTY(entry)).toBeTrue();
    });
    expect(isPTY('O')).toBeFalse();
  });
});
