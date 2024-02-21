import { HighlightTermsPipe } from './highlight-terms.pipe';

describe('HighlightTermsPipe', () => {
  it('create an instance', () => {
    const pipe = new HighlightTermsPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return value for null value', () => {
    let expectedRetval;
    let testValue;
    const testTerm = 'testTerm';
    const testHighlightTermsPipe = new HighlightTermsPipe();
    const retval = testHighlightTermsPipe.transform(
      testValue, testTerm);
    expect(retval).toEqual(expectedRetval);
  });

  it('test undefined value', () => {
    let testValue;
    const testTerm = 'testTerm';
    const expectedRetval = testValue;

    const testHighlightTermsPipe = new HighlightTermsPipe();
    const retval = testHighlightTermsPipe.transform(
      testValue, testTerm);
    expect(retval).toEqual(expectedRetval);
  });

  it('test undefined term', () => {
    const testValue = 'testValue';
    let testTerm;
    const expectedRetval = testValue;

    const testHighlightTermsPipe = new HighlightTermsPipe();
    const retval = testHighlightTermsPipe.transform(
      testValue, testTerm);
    expect(retval).toEqual(expectedRetval);
  });

  it('test happy path', () => {
    const testValue = 'the TESTterm testValue containing the testTerm ' +
      'including The TESTTERM four times the testTERM';
    const testTerm = 'the testTerm';
    const expectedRetval = '<mark>the</mark> <mark>TESTterm</mark> ' + 
      'testValue containing <mark>the</mark> <mark>testTerm</mark> ' +
      'including <mark>The</mark> <mark>TESTTERM</mark> four times ' +
      '<mark>the</mark> <mark>testTERM</mark>';

    const testHighlightTermsPipe = new HighlightTermsPipe();
    const retval = testHighlightTermsPipe.transform(
      testValue, testTerm);
    expect(retval).toEqual(expectedRetval);
  });

});
