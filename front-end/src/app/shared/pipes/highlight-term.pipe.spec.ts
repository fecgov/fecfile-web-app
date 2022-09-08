import { HighlightTermPipe } from './highlight-term.pipe';

describe('HighlightTermPipe', () => {
  it('create an instance', () => {
    const pipe = new HighlightTermPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return value for null value', () => {
    let expectedRetval;
    let testValue;
    const testTerm = 'testTerm';
    const testHighlightTermPipe = new HighlightTermPipe();
    const retval = testHighlightTermPipe.transform(
      testValue, testTerm);
    expect(retval).toEqual(expectedRetval);
  });

  it('test undefined value', () => {
    let testValue;
    const testTerm = 'testTerm';
    const expectedRetval = testValue;

    const testHighlightTermPipe = new HighlightTermPipe();
    const retval = testHighlightTermPipe.transform(
      testValue, testTerm);
    expect(retval).toEqual(expectedRetval);
  });

  it('test undefined term', () => {
    const testValue = 'testValue';
    let testTerm;
    const expectedRetval = testValue;

    const testHighlightTermPipe = new HighlightTermPipe();
    const retval = testHighlightTermPipe.transform(
      testValue, testTerm);
    expect(retval).toEqual(expectedRetval);
  });

  it('test happy path', () => {
    const testValue = 'the TESTterm testValue containing the testTerm ' +
      'including The TESTTERM four times the testTERM';
    const testTerm = 'the testTerm';
    const expectedRetval = '<mark>the TESTterm</mark> testValue ' +
      'containing <mark>the testTerm</mark> including <mark>The ' +
      'TESTTERM</mark> four times <mark>the testTERM</mark>';

    const testHighlightTermPipe = new HighlightTermPipe();
    const retval = testHighlightTermPipe.transform(
      testValue, testTerm);
    expect(retval).toEqual(expectedRetval);
  });

});
