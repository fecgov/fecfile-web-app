import { F3xSummary, F3xFormTypes } from './f3x-summary.model';

describe('F3XSummary', () => {
  it('should create an instance', () => {
    expect(new F3xSummary()).toBeTruthy();
  });

  it('#fromJSON() should return a populated F3xSummary instance', () => {
    const data = {
      id: '999',
      form_type: F3xFormTypes.F3XT,
      committee_name: 'foo',
    };
    const f3xSummary: F3xSummary = F3xSummary.fromJSON(data);
    expect(f3xSummary).toBeInstanceOf(F3xSummary);
    expect(f3xSummary.id).toBe('999');
    expect(f3xSummary.form_type).toBe(F3xFormTypes.F3XT);
    expect(f3xSummary.committee_name).toBe('foo');
    expect(f3xSummary.election_code).toBe(null);
  });
});
