import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Router, RouterLink } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ImportService } from './import.service';

@Component({
  selector: 'app-import',
  imports: [FileUploadModule, ButtonModule, RouterLink, FileUploadModule],
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss',
})
export class ImportComponent {
  protected readonly router: Router = inject(Router);
  private readonly importService = inject(ImportService);
  readonly uploading = signal(false);
  readonly uploadResponse = signal<unknown>(undefined);
  submitForm() {
    // Implement form submission logic here
  }

  resetResult(): void {
    // this.status.set('');
    // this.error.set('');
    this.uploadResponse.set(undefined);
  }
  async upload(event: any) {
    if (this.uploading()) return;
    this.resetResult();
    const file = event.files[0];
    this.uploading.set(true);
    try {
      const result = await this.importService.upload<unknown>(file);
      this.uploadResponse.set(result);
      // this.status.set('Upload complete. See the API response below for the import result.');
    } catch (error: unknown) {
      // this.status.set('');
      if (error instanceof HttpErrorResponse) {
        // this.error.set(`Upload failed (HTTP ${error.status}). See the API response below for details.`);
        // Avoid displaying HTML error pages, while retaining structured validation errors.
        // if (error.error !== null && typeof error.error === 'object') this.uploadResponse.set(error.error);
      } else {
        // this.error.set('Upload failed. Please try again.');
      }
    } finally {
      this.uploading.set(false);
    }
  }
  disableSubmission() {}

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
