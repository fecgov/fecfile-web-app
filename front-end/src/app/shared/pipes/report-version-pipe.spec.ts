import { ReportVersionPipe } from './report-version.pipe';
import { Report } from '../models/report.model';

describe('ReportVersionPipe', () => {
  let pipe: ReportVersionPipe;

  beforeEach(() => {
    pipe = new ReportVersionPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms should return Original for non-amendment', () => {
    expect(pipe.transform({ form_type: 'F3XN' } as Report)).toBe('Original');
  });

  it('transforms should return Amendment with version', () => {
    expect(pipe.transform({ form_type: 'F3XA', report_version: '2' } as Report)).toBe('Amendment 2');
  });
});