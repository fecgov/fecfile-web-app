import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ImportService } from 'app/shared/services/import.service';
import { environment } from 'environments/environment';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-import',
  imports: [FileUpload, JsonPipe, Message],
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss',
})
export class ImportComponent {
  private readonly importService = inject(ImportService);
  readonly maxFileSize = 10 * 1024 * 1024;
  readonly uploading = signal(false);
  readonly status = signal('');
  readonly error = signal('');
  readonly response = signal<unknown>(undefined);

  resetResult(): void {
    this.status.set('');
    this.error.set('');
    this.response.set(undefined);
  }

  async upload(event: FileUploadHandlerEvent): Promise<void> {
    if (this.uploading()) return;
    this.resetResult();
    if (event.files.length !== 1) {
      this.error.set('Choose one CSV file at a time.');
      return;
    }
    const file = event.files[0];
    if (!file || !file.name.toLowerCase().endsWith('.csv') || file.size === 0 || file.size > this.maxFileSize) {
      this.error.set('Choose a nonempty CSV file up to 10 MB.');
      return;
    }

    this.uploading.set(true);
    this.status.set('Uploading…');
    try {
      const result = await this.importService.upload<unknown>(environment.importUploadEndpoint, file);
      this.response.set(result);
      this.status.set('Upload complete. See the API response below for the import result.');
    } catch (error: unknown) {
      this.status.set('');
      if (error instanceof HttpErrorResponse) {
        if (error.status === 404 || error.status === 501) {
          this.error.set('The import endpoint is not available yet. No import was confirmed.');
        } else if (error.status === 0) {
          this.error.set('Could not reach the API. Check that it is running and try again.');
        } else {
          this.error.set(`Upload failed (HTTP ${error.status}). See the API response below for details.`);
        }
        // Avoid displaying HTML error pages, while retaining structured validation errors.
        if (error.error !== null && typeof error.error === 'object') this.response.set(error.error);
      } else {
        this.error.set('Upload failed. Please try again.');
      }
    } finally {
      this.uploading.set(false);
    }
  }
}
