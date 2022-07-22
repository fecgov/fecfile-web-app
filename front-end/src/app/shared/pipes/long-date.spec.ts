import { LongDatePipe } from './long-date.pipe';

describe('LongDatePipe', () => {
  let pipe: LongDatePipe;

  beforeEach(() => {
    pipe = new LongDatePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms should return the correctly formatted date', () => {
    expect(pipe.transform(new Date(2002, 6, 27))).toBe('July 27, 2002');
  });

  it('returns empty for missing date', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
