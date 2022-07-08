import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { UserLoginData } from 'app/shared/models/user.model';
import { selectUserLoginData } from 'app/store/login.selectors';
import { environment } from '../../../environments/environment';
import { F3xCoverageDates, F3xSummary } from '../models/f3x-summary.model';
import { F3xSummaryService } from './f3x-summary.service';

describe('F3xSummaryService', () => {
  let service: F3xSummaryService;
  let httpTestingController: HttpTestingController;
  const userLoginData: UserLoginData = {
    committee_id: 'C00000000',
    email: 'email@fec.com',
    is_allowed: true,
    token: 'jwttokenstring',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        F3xSummaryService,
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: selectUserLoginData, value: userLoginData }],
        }),
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(F3xSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getF3xCoverageDates return F3xCoverageDates list', () => {
    const f3xCoverageDates: F3xCoverageDates[] = 
      [F3xCoverageDates.fromJSON({
        "report_code": "Q1",
        "coverage_from_date": "2022-01-01",
        "coverage_through_date": "2022-03-31"
      })];

    service.getF3xCoverageDates().subscribe((response: F3xCoverageDates[]) => {
      expect(response).toEqual(f3xCoverageDates);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/coverage_dates`);
    expect(req.request.method).toEqual('GET');
    req.flush(f3xCoverageDates);
    httpTestingController.verify();
  });

  it('#get should return a specific f3x summary record', () => {
    const f3xSummary: F3xSummary = F3xSummary.fromJSON({ id: 999 });

    service.get(999).subscribe((response: F3xSummary) => {
      expect(response).toEqual(f3xSummary);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/${f3xSummary.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(f3xSummary);
    httpTestingController.verify();
  });

  it('#create() should POST a payload', () => {
    const f3xSummary: F3xSummary = new F3xSummary();

    service.create(f3xSummary).subscribe((response: F3xSummary) => {
      expect(response).toEqual(f3xSummary);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/?fields_to_validate=`);
    expect(req.request.method).toEqual('POST');
    req.flush(f3xSummary);
    httpTestingController.verify();
  });

  it('#update() should PUT a payload', () => {
    const f3xSummary: F3xSummary = F3xSummary.fromJSON({ id: 999 });

    service.update(f3xSummary).subscribe((response: F3xSummary) => {
      expect(response).toEqual(f3xSummary);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/f3x-summaries/${f3xSummary.id}/?fields_to_validate=`
    );
    expect(req.request.method).toEqual('PUT');
    req.flush(f3xSummary);
    httpTestingController.verify();
  });

  it('#delete() should DELETE a record', () => {
    const f3xSummary: F3xSummary = F3xSummary.fromJSON({ id: 999 });

    service.delete(f3xSummary).subscribe((response: null) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/f3x-summaries/999`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
    httpTestingController.verify();
  });
});
