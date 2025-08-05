import { SchBTransaction, ScheduleBTransactionTypes } from './schb-transaction.model';
import { ReattRedesTypes } from '../utils/reatt-redes/reatt-redes.utils';
import { RedesignationFromUtils } from '../utils/reatt-redes/redesignation-from.utils';
import { RedesignationToUtils } from '../utils/reatt-redes/redesignation-to.utils';
import { testScheduleBTransaction } from '../utils/unit-test.utils';
import { RedesignatedUtils } from '../utils/reatt-redes/redesignated.utils';

describe('SchBTransaction', () => {
  it('should create an instance', () => {
    expect(new SchBTransaction()).toBeTruthy();
  });

  it('#fromJSON() should return a populated SchBTransaction instance', () => {
    const data = {
      id: '999',
      form_type: 'SA11Ai',
      payee_organization_name: 'foo',
      expenditure_date: undefined,
    };
    const transaction: SchBTransaction = SchBTransaction.fromJSON(data);
    expect(transaction).toBeInstanceOf(SchBTransaction);
    expect(transaction.id).toBe('999');
    expect(transaction.form_type).toBe('SA11Ai');
    expect(transaction.payee_organization_name).toBe('foo');
    expect(transaction.election_code).toBe(undefined);
  });

  it('Creates a transaction object from JSON', () => {
    const json = {
      transaction_type_identifier: 'RETURN_RECEIPT',
      parent_transaction: {
        transaction_type_identifier: 'RETURN_RECEIPT',
      },
      children: [
        {
          transaction_type_identifier: 'RETURN_RECEIPT',
        },
      ],
    };
    const transaction: SchBTransaction = SchBTransaction.fromJSON(json);
    expect(transaction.constructor.name).toBe('SchBTransaction');
  });

  describe('redesignation from json', () => {
    it('should create reattribution_redesignation from json', () => {
      const baseOverlaySpy = spyOn(RedesignatedUtils, 'overlayTransactionProperties').and.callThrough();

      const json = {
        transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        reattribution_redesignation_tag: ReattRedesTypes.REDESIGNATED,
        parent_transaction: {
          transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        },
        children: [
          {
            transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
          },
        ],
      };
      SchBTransaction.fromJSON(json);
      expect(baseOverlaySpy).toHaveBeenCalledTimes(1);
    });

    it('should create REDESIGNATED from json', () => {
      const overlaySpy = spyOn(RedesignatedUtils, 'overlayTransactionProperties').and.callThrough();

      const json = {
        transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        reattribution_redesignation_tag: ReattRedesTypes.REDESIGNATED,
        parent_transaction: {
          transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        },
        children: [
          {
            transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
          },
        ],
      };
      SchBTransaction.fromJSON(json);
      expect(overlaySpy).toHaveBeenCalledTimes(1);
    });

    it('should create REDESIGNATION_FROM from json', () => {
      const overlaySpy = spyOn(RedesignationFromUtils, 'overlayTransactionProperties').and.callThrough();
      const json = {
        transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        reattribution_redesignation_tag: ReattRedesTypes.REDESIGNATION_FROM,
        parent_transaction: {
          transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        },
        children: [
          {
            transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
          },
        ],
      };
      SchBTransaction.fromJSON(json);
      expect(overlaySpy).toHaveBeenCalledTimes(1);
    });

    it('should create REDESIGNATION_TO from json', () => {
      const overlaySpy = spyOn(RedesignationToUtils, 'overlayTransactionProperties').and.callThrough();
      const json = {
        transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        reattribution_redesignation_tag: ReattRedesTypes.REDESIGNATION_TO,
        parent_transaction: {
          transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        },
        children: [
          {
            transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
          },
        ],
      };
      SchBTransaction.fromJSON(json);
      expect(overlaySpy).toHaveBeenCalledTimes(1);
    });

    it('should create REDESIGNATION_TO from json', () => {
      const overlaySpy = spyOn(RedesignationToUtils, 'overlayTransactionProperties').and.callFake((trans) => {
        trans.reatt_redes = testScheduleBTransaction();
        return trans;
      });
      const json = {
        transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        reattribution_redesignation_tag: ReattRedesTypes.REDESIGNATION_TO,
        parent_transaction: {
          transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        },
        children: [
          {
            transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
          },
        ],
      };
      const transaction = SchBTransaction.fromJSON(json);
      expect(overlaySpy).toHaveBeenCalledTimes(1);
      expect(transaction.reatt_redes).toBeTruthy();
    });
  });
});
