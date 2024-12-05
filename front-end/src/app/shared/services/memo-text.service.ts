import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemoText } from '../models/memo-text.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class MemoTextService {
  constructor(private apiService: ApiService) {}

  public get(id: string): Observable<MemoText> {
    return this.apiService.get<MemoText>(`/memo-text/${id}/`).pipe(map((response) => MemoText.fromJSON(response)));
  }

  public getForReportId(reportId: string): Observable<MemoText[]> {
    return this.apiService
      .get<MemoText[]>(`/memo-text/?report_id=${reportId}`)
      .pipe(map((response) => response.map((memoText) => MemoText.fromJSON(memoText))));
  }

  public create(memoText: MemoText, fieldsToValidate: string[] = []): Observable<MemoText> {
    const payload = memoText.toJson();
    return this.apiService
      .post<MemoText>(`/memo-text/`, payload, { fields_to_validate: fieldsToValidate.join(',') })
      .pipe(map((response) => MemoText.fromJSON(response)));
  }

  public update(memoText: MemoText, fieldsToValidate: string[] = []): Observable<MemoText> {
    const payload = memoText.toJson();
    return this.apiService
      .put<MemoText>(`/memo-text/${memoText.id}/`, payload, { fields_to_validate: fieldsToValidate.join(',') })
      .pipe(map((response) => MemoText.fromJSON(response)));
  }

  public delete(memoText: MemoText): Observable<null> {
    return this.apiService.delete<null>(`/memo-text/${memoText.id}/`);
  }
}
