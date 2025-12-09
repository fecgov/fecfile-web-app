import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3 } from '../models/reports/form-3.model';
import { ApiService } from './api.service';
import { Form3Service } from './form-3.service';

describe('Form3Service', () => {
  let service: Form3Service;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'put']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Form3Service, { provide: ApiService, useValue: spy }, provideMockStore()],
    });
    service = TestBed.inject(Form3Service);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get coverage dates', async () => {
    const mockCoverageDates = [{ coverage_from_date: new Date(), report_code: 'Q1' }];
    const mockMap = { Q1: 'Quarter 1' };
    apiService.get.and.returnValues(Promise.resolve(mockCoverageDates), Promise.resolve(mockMap));

    const result = await service.getCoverageDates();
    expect(result.length).toBe(1);
    expect(apiService.get).toHaveBeenCalledTimes(2);
  });

  it('should get future reports', async () => {
    const mockReports = [Form3.fromJSON({})];
    apiService.get.and.returnValue(Promise.resolve(mockReports));
    const result = await service.getFutureReports('2023-01-01');
    expect(result.length).toBe(1);
  });

  it('should get final report', async () => {
    const mockReport = Form3.fromJSON({});
    apiService.get.and.returnValue(Promise.resolve(mockReport));
    const result = await service.getFinalReport(2024);
    expect(result).toBeTruthy();
  });
});
