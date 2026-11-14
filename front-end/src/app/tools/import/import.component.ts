import { Component, inject, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';
import { FileUploadModule, FileUpload, FileUploadEvent } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ImportService } from './import.service';
import { environment } from 'environments/environment.local';
import { getHeaders } from 'app/shared/services/api.service';

@Component({
  selector: 'app-import',
  imports: [FileUploadModule, ButtonModule],
  providers: [ImportService],
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss',
})
export class ImportComponent {
  protected readonly router: Router = inject(Router);
  private readonly cookieService = inject(CookieService);
  private readonly importService = inject(ImportService);

  readonly uploading = signal(false);
  readonly uploaded = signal<boolean | undefined>(undefined);
  readonly errored = signal<boolean | undefined>(undefined);
  readonly importId = signal<string | undefined>(undefined);

  readonly uploadUrl = `${environment.apiUrl}/imports/upload-file/`;
  readonly uploadHeaders = new HttpHeaders(getHeaders(this.cookieService)).delete('Content-Type');

  submitForm() {
    if (!this.importId()) {
      throw new Error('Import ID is not set');
    }

    this.importService.startParse(this.importId()!);
    this.router.navigateByUrl(`tools/import/${this.importId()}/review-plan`);
  }

  onUpload(event: any) {
    this.uploaded.set(true);
    this.importId.set(event?.originalEvent?.body?.id);
  }

  resetResult(): void {
    this.errored.set(undefined);
    this.uploaded.set(undefined);
  }

  disableSubmission() {
    return !this.uploaded() || this.errored() === true;
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
