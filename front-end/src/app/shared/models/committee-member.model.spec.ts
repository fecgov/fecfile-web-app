import { environment } from 'environments/environment';
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
    const committee_data_source = environment.committee_data_source;

    // TEST version
    environment.committee_data_source = 'test';
    expect(isPAC()).toBeFalse();
    const PAC = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'J'];
    PAC.forEach((entry) => {
      expect(isPAC(entry)).toBeTrue();
    });
    expect(isPAC('D')).toBeFalse();

    // PRODUCTION version
    environment.committee_data_source = 'production';
    expect(isPAC()).toBeFalse();
    const PAC_PRODUCTION = ['O', 'U', 'D', 'N', 'Q', 'V', 'W'];
    PAC_PRODUCTION.forEach((entry) => {
      expect(isPAC(entry)).toBeTrue();
    });
    expect(isPAC('X')).toBeFalse();

    environment.committee_data_source = committee_data_source;
  });

  it('should confirm if committee is PTY', () => {
    const committee_data_source = environment.committee_data_source;

    // TEST version
    environment.committee_data_source = 'test';
    expect(isPTY()).toBeFalse();
    expect(isPTY('Y')).toBeFalse();
    expect(isPTY('D')).toBeTrue();
    expect(isPTY('J')).toBeFalse();
    expect(isPTY('X')).toBeFalse();
    expect(isPTY('O')).toBeFalse();

    // PRODUCTION version
    environment.committee_data_source = 'production';
    expect(isPTY()).toBeFalse();
    expect(isPTY('Y')).toBeFalse();
    expect(isPTY('X')).toBeFalse();
    expect(isPTY('Y', 'U')).toBeTrue();
    expect(isPTY('Y', 'J')).toBeTrue();
    expect(isPTY('X', 'U')).toBeFalse();
    expect(isPTY('X', 'J')).toBeTrue();
    expect(isPTY('O', 'U')).toBeFalse();

    // reset committee_data_source
    environment.committee_data_source = committee_data_source;
  });
});
