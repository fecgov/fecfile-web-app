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
});
