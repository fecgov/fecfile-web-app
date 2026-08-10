import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Feedback } from '../models/feedback.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly apiService = inject(ApiService);

  public async submitFeedback(feedback: Feedback): Promise<void> {
    const response = await this.apiService.post<void>(
      `/feedback/submit/`,
      { ...feedback, location: globalThis.location.href },
      {},
      [HttpStatusCode.BadRequest, HttpStatusCode.InternalServerError],
    );
    if (!response.body) {
      throw new Error('Invalid feedback submission');
    }
  }
}
