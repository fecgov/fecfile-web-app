// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Report } from '../models/report.model';
// import { TableListService } from '../interfaces/table-list-service.interface';
// import { ListRestResponse } from '../models/rest-api.model';
// import { F3xSummaryService } from './f3x-summary.service';
// import { F3xSummary } from '../models/f3x-summary.model';

// @Injectable({
//   providedIn: 'root',
// })
// export class ReportService implements TableListService<Report> {
//   constructor(private f3xSummaryService: F3xSummaryService) {}

//   public getTableData(pageNumber = 1): Observable<ListRestResponse> {
//     return this.apiService.get<ListRestResponse>(`/f3x-summaries/?page=${pageNumber}`).pipe(
//       map((response: ListRestResponse) => {
//         response.results = response.results.map((item) => F3xSummary.fromJSON(item));
//         return response;
//       })
//     );
//   }

//   public create(data: Report): Observable<F3xSummary> {
//     return this.f3xSummaryService.create(data);
//   }

//   public update(f3xSummary: F3xSummary): Observable<F3xSummary> {
//     const payload = f3xSummary.toJson();
//     return this.apiService
//       .put<F3xSummary>(`/f3x-summaries/${f3xSummary.id}/`, payload)
//       .pipe(map((response) => F3xSummary.fromJSON(response)));
//   }

//   public delete(f3xSummary: F3xSummary): Observable<null> {
//     return this.apiService.delete<null>(`/f3x-summaries/${f3xSummary.id}`);
//   }
// }
