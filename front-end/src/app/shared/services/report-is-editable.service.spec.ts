import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { F3xSummary } from '../models/f3x-summary.model';
import { FECUploadStatus } from '../models/fec-upload-status.model';
import { selectActiveReport } from '../../store/active-report.selectors';
import { ReportIsEditableService } from './report-is-editable.service'

describe('TransactionService', () => {
  let httpTestingController: HttpTestingController;
  let service: ReportIsEditableService;

  const activeReport: F3xSummary = F3xSummary.fromJSON({
    upload_submission: FECUploadStatus.fromJSON({
      fec_status:"ACCEPTED"
    })
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReportIsEditableService,
        provideMockStore({
          initialState: { activeReport: activeReport },
          selectors: [{ selector: selectActiveReport, value: activeReport }],
        }),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ReportIsEditableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have stubbed out "Delete" methods', () => {
    const observe = service.isEditable();
    observe.subscribe((bool: boolean)=>{
      expect(bool).toBe(false);
    })
  });
});
