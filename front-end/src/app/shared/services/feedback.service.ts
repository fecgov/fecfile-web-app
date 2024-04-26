import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Feedback } from '../models/feedback.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(private apiService: ApiService) {}

  public submitFeedback(feedback: Feedback): Promise<void> {
    return firstValueFrom(
      this.apiService
        .post<void>(`/feedback/submit/`, feedback, {}, [HttpStatusCode.BadRequest, HttpStatusCode.InternalServerError])
        .pipe(
          map((response) => {
            if (!response.body) {
              throw new Error();
            }
          }),
        ),
    );
  }
}
