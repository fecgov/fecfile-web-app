import { TransactionIdPipe } from './transaction-id.pipe';

describe('TransactionIdPipe', () => {
  let pipe: TransactionIdPipe;

  beforeEach(() => {
    pipe = new TransactionIdPipe();
  });

  it('Create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Transforms should return the correctly formatted value', () => {
    expect(pipe.transform('271da73858hj841')).toBe('271DA738');
  });

  it('Returns empty for null value', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
