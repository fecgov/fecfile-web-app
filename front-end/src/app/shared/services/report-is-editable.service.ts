import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { selectActiveReport } from '../../store/active-report.selectors';
import { Report } from '../interfaces/report.interface';

@Injectable({
  providedIn: 'root',
})
export class ReportIsEditableService {
  constructor(private store: Store) {}

  isEditable(): Observable<boolean> {
    return this.store.select(selectActiveReport).pipe(
      map((report: Report | null) => {
        return this.isEditableLogic(report);
      })
    );
  }

  isEditableLogic(report: Report | null): boolean {
    const uploadSubmission = report?.upload_submission;
    const fecStatus = report?.upload_submission?.fec_status;
    const fecfileTaskState = report?.upload_submission?.fecfile_task_state;
    return !uploadSubmission || fecStatus == 'REJECTED' || fecfileTaskState == 'FAILED';
  }
}
