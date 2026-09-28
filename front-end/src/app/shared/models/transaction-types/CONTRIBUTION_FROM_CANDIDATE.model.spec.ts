import { ReportTypes } from '../reports/report.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { ContactTypes } from '../contact.model';
import { CONTRIBUTION_FROM_CANDIDATE } from './CONTRIBUTION_FROM_CANDIDATE.model';

describe('CONTRIBUTION_FROM_CANDIDATE', () => {
  const transactionType = new CONTRIBUTION_FROM_CANDIDATE();

  it('creates a Schedule A candidate contribution', () => {
    const transaction = transactionType.getNewTransaction() as SchATransaction;

    expect(transaction.form_type).toBe('SA11D');
    expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.CONTRIBUTION_FROM_CANDIDATE);
  });

  it('shows election information only for Form 3', () => {
    expect(transactionType.hasElectionInformation(ReportTypes.F3)).toBe(true);
    expect(transactionType.hasElectionInformation(ReportTypes.F3X)).toBe(false);
  });

  it('uses a primary candidate contact and displays its fields', () => {
    expect(transactionType.contactTypeOptions).toEqual([ContactTypes.CANDIDATE]);
    expect(transactionType.formFields).toContain('candidate_fec_id');
    expect(transactionType.formFields).toContain('candidate_last_name');
    expect(transactionType.formFields).toContain('candidate_first_name');
    expect(transactionType.hasCandidateOffice()).toBe(true);
    expect(transactionType.formFields).toContain('candidate_office');
    expect(transactionType.formFields).toContain('candidate_state');
    expect(transactionType.formFields).toContain('candidate_district');
    expect(transactionType.candidateContactIsPrimary).toBe(true);
    expect(transactionType.hasCandidateInformation()).toBe(false);
    expect(transactionType.contactConfig.contact_1.candidate_office).toBe('candidate_office');
    expect(transactionType.contactConfig.contact_1.candidate_state).toBe('candidate_state');
    expect(transactionType.contactConfig.contact_1.candidate_district).toBe('candidate_district');
    expect(transactionType.hasEmployeeFields()).toBe(true);
    expect(transactionType.contactConfig.contact_1.employer).toBe('employer');
    expect(transactionType.contactConfig.contact_1.occupation).toBe('occupation');
  });
});
