import { FecDatePipe } from './fec-date.pipe';

describe('FecDatePipe', () => {
  let pipe: FecDatePipe;

  beforeEach(() => {
    pipe = new FecDatePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms should return the correctly formatted date', () => {
    expect(pipe.transform('20020727')).toBe('07/27/2002');
  });

  it('returns empty for missing date', () => {
    expect(pipe.transform('')).toBe('');
  });
});
