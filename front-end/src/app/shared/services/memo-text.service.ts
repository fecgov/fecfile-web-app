import { inject, Injectable } from '@angular/core';
import { MemoText } from '../models/memo-text.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class MemoTextService {
  private readonly apiService = inject(ApiService);

  public async get(id: string): Promise<MemoText> {
    const response = await this.apiService.get<MemoText>(`/memo-text/${id}/`);
    return MemoText.fromJSON(response);
  }

  public async getForReportId(reportId: string): Promise<MemoText[]> {
    const response = await this.apiService.get<MemoText[]>(`/memo-text/?report_id=${reportId}`);
    return response.map((memoText) => MemoText.fromJSON(memoText));
  }

  public async create(memoText: MemoText, fieldsToValidate: string[] = []): Promise<MemoText> {
    const payload = memoText.toJson();
    const response = await this.apiService.post<MemoText>(`/memo-text/`, payload, {
      fields_to_validate: fieldsToValidate.join(','),
    });
    return MemoText.fromJSON(response);
  }

  public async update(memoText: MemoText, fieldsToValidate: string[] = []): Promise<MemoText> {
    const payload = memoText.toJson();
    const response = await this.apiService.put<MemoText>(`/memo-text/${memoText.id}/`, payload, {
      fields_to_validate: fieldsToValidate.join(','),
    });
    return MemoText.fromJSON(response);
  }

  public delete(memoText: MemoText): Promise<null> {
    return this.apiService.delete<null>(`/memo-text/${memoText.id}/`);
  }
}
