import { ScheduleATransactionTypes } from '../models/type-enums';
import { PAC_ONLY, PTY_ONLY, TransactionTypeUtils } from './transaction-type.utils';

describe('TransactionTypeUtils', () => {
  it('should create an instance', () => {
    expect(new TransactionTypeUtils()).toBeTruthy();
  });

  it('non-existing transaction type should throw an error', async () => {
    try {
      await TransactionTypeUtils.factory('DOES_NOT_EXIST');
    } catch (error) {
      const a = new Error(`FECfile+: Class transaction type of 'DOES_NOT_EXIST' is not found`);
      expect(error).toEqual(a);
    }
  });

  it('should return list of Transaction Types PAC does not need access to', () => {
    [
      ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY,
      ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
      ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ].forEach((r) => {
      expect(PAC_ONLY().has(r));
    });
  });

  it('should return list of Transaction Types PTY does not need access to', () => {
    [
      ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
      ScheduleATransactionTypes.OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
      ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
    ].forEach((r) => {
      expect(PTY_ONLY().has(r));
    });
  });
});
