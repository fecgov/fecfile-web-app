import { Component, inject } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-import',
  imports: [FileUploadModule, ButtonModule, RouterLink, FileUploadModule],
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss',
})
export class ImportComponent {
  protected readonly router: Router = inject(Router);
  submitForm() {
    // Implement form submission logic here
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
