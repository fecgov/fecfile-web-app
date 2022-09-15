import { DefaultZeroPipe } from './default-zero.pipe';

describe('DefaultZeroPipe', () => {
  it('create an instance', () => {
    const pipe = new DefaultZeroPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return 0 for null', () => {
    const pipe = new DefaultZeroPipe();
    expect(pipe.transform(undefined)).toBe(0);
  });

  it('should return the value if not null', () => {
    const pipe = new DefaultZeroPipe();
    expect(pipe.transform(2727)).toBe(2727);
  });
});
