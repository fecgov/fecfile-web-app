import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Feedback } from '../models/feedback.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(private apiService: ApiService) { }

  public submitFeedback(feedback: Feedback): Promise<void> {
    return firstValueFrom(
      this.apiService.post<void>(`/feedback/submit/`, feedback).pipe(map((response) => response))
    );
  }
}
