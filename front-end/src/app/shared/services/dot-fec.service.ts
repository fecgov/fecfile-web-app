import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { Report } from '../models/report.model';
import { Actions } from '@ngrx/effects';

export interface Download {
  id?: string;
  taskId: string;
  isComplete: boolean;
  name: string;
  report: Report;
}

@Injectable({
  providedIn: 'root',
})
export class DotFecService {
  downloads = new BehaviorSubject<Download[]>([]);
  renderer: Renderer2;

  constructor(
    private apiService: ApiService,
    private actions: Actions,
    rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.actions.subscribe((action) => {
      if (action.type === '[User Login Data] Discarded') {
        this.downloads.next([]);
      }
    });
  }

  async generateFecFile(report: Report): Promise<Download> {
    const response = await firstValueFrom(
      this.apiService.post<{ status: string; file_name: string; task_id: string }>(`/web-services/dot-fec/`, {
        report_id: report.id,
      }),
    );
    const downloads = this.downloads.getValue();
    const download = { taskId: response.task_id, report, name: response.file_name, isComplete: false };
    downloads.push(download);
    this.downloads.next(downloads);
    return download;
  }

  async downloadFecFile(download: Download): Promise<void> {
    const dotFEC = await firstValueFrom(this.apiService.getString(`/web-services/dot-fec/${download.id}/`));
    const newBlob = new Blob([dotFEC], { type: 'application/text' });
    const data = window.URL.createObjectURL(newBlob);
    const link = this.renderer.createElement('a');
    this.renderer.setAttribute(link, 'href', data);
    this.renderer.setAttribute(link, 'download', download.report.id + '.fec');
    this.renderer.appendChild(document.body, link);
    link.click();
  }

  async checkFecFileTask(download: Download): Promise<void> {
    if (!download) return;
    let isComplete = false;
    let id: string | undefined = undefined;
    while (!isComplete) {
      id = await this.checkFecFile(download.taskId);
      isComplete = !!id;
    }
    const downloads = this.downloads.getValue().map((d) => {
      if (d.name !== download.name) return d;
      d.isComplete = true;
      d.id = id;
      return d;
    });
    this.downloads.next(downloads);
  }

  private async checkFecFile(taskId: string): Promise<string | undefined> {
    const response = await firstValueFrom(
      this.apiService.get<{ done: boolean; id?: string }>(`/web-services/dot-fec/check/${taskId}/`),
    );
    return response.id;
  }
}
