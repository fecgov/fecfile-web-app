import { ScheduleATransactionTypes } from '../models/scha-transaction.model';
import { PACRestricted, PTYRestricted, TransactionTypeUtils, getFromJSON } from './transaction-type.utils';

describe('TransactionTypeUtils', () => {
  it('should create an instance', () => {
    expect(new TransactionTypeUtils()).toBeTruthy();
  });

  it('non-existing transaction type should throw an error', () => {
    expect(() => {
      TransactionTypeUtils.factory('DOES_NOT_EXIST');
    }).toThrow(new Error("Fecfile: Class transaction type of 'DOES_NOT_EXIST' is not found"));
  });

  it('should return the correct schedule object given a scheduleId', () => {
    const testJSON = {
      transaction_type_identifier: 'LOAN_RECEIVED_FROM_INDIVIDUAL',
    };

    let scheduleObject = getFromJSON(testJSON);
    expect(scheduleObject.constructor.name).toBe('SchCTransaction');

    testJSON.transaction_type_identifier = 'DEBT_OWED_TO_COMMITTEE';
    scheduleObject = getFromJSON(testJSON);
    expect(scheduleObject.constructor.name).toBe('SchDTransaction');

    testJSON.transaction_type_identifier = 'INDEPENDENT_EXPENDITURE';
    scheduleObject = getFromJSON(testJSON);
    expect(scheduleObject.constructor.name).toBe('SchETransaction');
  });

  it('should return list of Transaction Types PAC does not need access to', () => {
    [
      ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY,
      ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
      ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ].forEach((r) => {
      expect(PACRestricted().includes(r));
    });
  });

  it('should return list of Transaction Types PTY does not need access to', () => {
    [
      ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
      ScheduleATransactionTypes.OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
      ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
    ].forEach((r) => {
      expect(PTYRestricted().includes(r));
    });
  });

  it('should remove leading zeroes from Transactions', () => {
    const testJSON = { line_label: '09' };
    const scheduleObject = getFromJSON(testJSON);
    expect(scheduleObject.line_label).toBe('9');
  });
});
