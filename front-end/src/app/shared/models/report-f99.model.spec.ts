import { ReportF99, F99FormTypes } from './report-f99.model';

describe('ReportF99', () => {
  it('should create an instance', () => {
    expect(new ReportF99()).toBeTruthy();
  });

  it('#fromJSON() should return a populated ReportF99 instance', () => {
    const data = {
      id: '999',
      form_type: F99FormTypes.F99,
      committee_name: 'foo',
    };
    const reportF99: ReportF99 = ReportF99.fromJSON(data);
    expect(reportF99).toBeInstanceOf(ReportF99);
    expect(reportF99.id).toBe('999');
    expect(reportF99.form_type).toBe(F99FormTypes.F99);
    expect(reportF99.committee_name).toBe('foo');
  });
});
