import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { selectActiveReport } from "../../store/active-report.selectors";
import { Report } from "../interfaces/report.interface";

@Injectable({
  providedIn: 'root',
})
export class ReportIsEditableService {
  constructor(private store: Store){}

  isEditable(): Observable<boolean> {
    let observe = new Observable<boolean>();
    this.store.select(selectActiveReport).subscribe((report: Report | null)=>{
      const status = report?.upload_submission?.fec_status;
      const bool = status != "ACCEPTED" && status != "PROCESSING";
      observe = of(bool);
    });
    return observe;
  }


}