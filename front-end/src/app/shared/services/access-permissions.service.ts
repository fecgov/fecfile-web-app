import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, mergeMap } from "rxjs";
import { selectActiveReport } from "../../store/active-report.selectors";
import { Report } from "../interfaces/report.interface";

@Injectable({
  providedIn: 'root',
})
export class ReportIsEditableService {
  constructor(private store: Store){}

  isEditable(): Observable<boolean> {
    return new Observable<boolean>(()=>{
      /*const report$ = this.store.select(selectActiveReport);
      return report$.pipe(mergeMap((report)=>{
          const status = report?.upload_status?.status;
          const bool = status != "ACCEPTED" && status != "PROCESSING";
          console.log("EDITABLE GUARD CALLED", bool);
          return bool
      }))
          WIP Section
      */


      return this.store.select(selectActiveReport).subscribe((report: Report | null)=>{
        if (report){
          const status = report?.upload_status?.status;
          const bool = status != "ACCEPTED" && status != "PROCESSING";
          console.log("EDITABLE GUARD CALLED", bool);
          return bool
        } else {
          return false
        }
      });
    });
  }
}