import { User, CommitteeUser } from './user.model';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User()).toBeTruthy();
  });
});

describe('CommitteeUser', () => {
  it('should create an instance', () => {
    expect(new CommitteeUser()).toBeTruthy();
  });
  it('should be created correctly from JSON', () => {
    const json = {
      role: 'C_ADMIN',
      first_name: 'test',
      last_name: 'testson',
      email: 'test@test.com',
      is_active: true,
    };
    const cUser = CommitteeUser.fromJSON(json);
    expect(cUser.first_name).toBe(json['first_name']);
    expect(cUser.last_name).toBe(json['last_name']);
    expect(cUser.email).toBe(json['email']);
    expect(cUser.role).toBe(json['role']);
    expect(cUser.is_active).toBe(json['is_active']);
  });
  it('should return the correct role label when role is not null', () => {
    const cUser = new CommitteeUser();
    cUser.role = 'C_ADMIN';
    expect(cUser.getRoleLabel()).toBe('Committee Administrator');
  });
  it('should return null for a role label if role is null', () => {
    expect(new CommitteeUser().getRoleLabel()).toBe(null);
  });
  it('should return null for a label if the role is invalid', () => {
    const cUser = new CommitteeUser();
    cUser.role = "This Isn't a Real Role";
    expect(cUser.getRoleLabel()).toBe(null);
  });
});
