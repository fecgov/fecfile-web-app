import { currentYear } from '../../pages/pageUtils';
import { buildScheduleA, buildScheduleF } from '../../requests/library/transactions';
import { makeTransaction } from '../../requests/methods';
import { DataSetup } from '../setup';

type AggregateScheduleFSeed = [number, string, boolean];

function createTransactionsSequentially(transactions: any[]) {
  let chain: Cypress.Chainable<unknown> = cy.wrap(null, { log: false });
  transactions.forEach((transaction) => {
    chain = chain.then(() => makeTransaction(transaction));
  });
  return chain.then(() => undefined);
}

export function setupAggregateScheduleATransactions(secondSame: boolean) {
  return DataSetup({ individual: true, individual2: true }).then((result: any) => {
    const transactionA = buildScheduleA(
      'INDIVIDUAL_RECEIPT',
      200.01,
      `${currentYear}-04-12`,
      result.individual,
      result.report,
    );
    const transactionB = buildScheduleA(
      'INDIVIDUAL_RECEIPT',
      25,
      `${currentYear}-04-16`,
      secondSame ? result.individual : result.individual2,
      result.report,
    );

    return createTransactionsSequentially([transactionA, transactionB]).then(() => result);
  });
}

export function setupAggregateScheduleFTransactions(transData: AggregateScheduleFSeed[]) {
  return DataSetup({
    individual: true,
    candidate: true,
    candidateSenate: true,
    committee: true,
    organization: true,
  }).then((result: any) => {
    const transactions = transData.map((data) =>
      buildScheduleF(
        data[0],
        data[1],
        result.individual,
        data[2] ? result.candidate : result.candidateSenate,
        result.committee,
        result.report,
      ),
    );

    return createTransactionsSequentially(transactions).then(() => result);
  });
}

