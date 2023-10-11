import { ReportVersionPipe } from './report-version.pipe';
import { Report } from '../interfaces/report.interface';

describe('ReportVersionPipe', () => {
  let pipe: ReportVersionPipe;

  beforeEach(() => {
    pipe = new ReportVersionPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms should return Original for non-amendment', () => {
    expect(pipe.transform({ form_type: 'F3XN' } as Report)).toBe('Orignial');
  });

  it('transforms should return Amendment with version', () => {
    expect(pipe.transform({ form_type: 'F3XA', report_version: '2' } as Report)).toBe('Amendment 2');
  });
});
