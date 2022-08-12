import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { F3xSummary } from '../models/f3x-summary.model';
import { WebPrintService } from './web-print.service';

describe('WebPrintService', () => {
  let service: WebPrintService;
  let httpTestingController: HttpTestingController;
  const f3x: F3xSummary = F3xSummary.fromJSON({
    id: 999,
    coverage_from_date: '2022-05-25',
    form_type: 'F3XN',
    report_code: 'Q1',
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WebPrintService,
        provideMockStore({
          selectors: [{ selector: selectReportCodeLabelList, value: {} }],
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: f3x,
              },
            },
          },
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(WebPrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
