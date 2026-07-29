import { Initialize } from '../../e2e-smoke/pages/loginPage';

describe('Users Permissions via Committee Switch RBAC', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should set candidate office, state, and district', () => {
	cy.visit("/committee");
	const fecfile_online_committeeAccount = localStorage.getItem('fecfile_online_committeeAccount');
	if (!fecfile_online_committeeAccount) return;
	const json = JSON.parse(fecfile_online_committeeAccount);
	expect(json.candidate_district).to.equal('2');
	expect(json.candidate_office).to.equal('P');
	expect(json.candidate_state).to.equal('DC');
  });
});