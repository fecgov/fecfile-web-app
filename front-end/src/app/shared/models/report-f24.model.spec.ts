import { ReportF24, F24FormTypes } from './report-f24.model';

describe('ReportF24', () => {
  it('should create an instance', () => {
    expect(new ReportF24()).toBeTruthy();
  });

  it('#fromJSON() should return a populated ReportF24 instance', () => {
    const data = {
      id: '999',
      form_type: F24FormTypes.F24N,
      committee_name: 'foo',
    };
    const reportF24: ReportF24 = ReportF24.fromJSON(data);
    expect(reportF24).toBeInstanceOf(ReportF24);
    expect(reportF24.id).toBe('999');
    expect(reportF24.form_type).toBe(F24FormTypes.F24N);
    expect(reportF24.committee_name).toBe('foo');
  });
});
