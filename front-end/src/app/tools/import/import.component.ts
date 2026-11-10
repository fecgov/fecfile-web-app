import { JsonPipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { ACTIVE_IMPORT_STATES, ContactImportJob, ImportService } from 'app/shared/services/import.service';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
import { Message } from 'primeng/message';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-import',
  imports: [FileUpload, JsonPipe, Message, ButtonDirective],
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss',
})
export class ImportComponent {
  private readonly importService = inject(ImportService);
  private readonly destroyRef = inject(DestroyRef);
  private watcher?: Subscription;
  readonly maxFileSize = 10 * 1024 * 1024;
  readonly uploading = signal(false);
  readonly status = signal('');
  readonly error = signal('');
  readonly job = signal<ContactImportJob | null>(null);
  readonly checkingFailed = signal(false);
  readonly canConfirm = computed(
    () => this.job()?.import_status === 'PARSED' && !this.uploading() && !this.checkingFailed(),
  );

  resetResult(): void {
    this.watcher?.unsubscribe();
    this.status.set('');
    this.error.set('');
    this.job.set(null);
    this.checkingFailed.set(false);
  }

  private showJob(job: ContactImportJob): void {
    this.job.set(job);
    this.uploading.set(ACTIVE_IMPORT_STATES.has(job.import_status));
    switch (job.import_status) {
      case 'CREATED':
      case 'PARSING':
        this.status.set('Validating contacts…');
        break;
      case 'PARSED':
        this.status.set(`${job.total_rows} contacts passed validation. Confirm to import them.`);
        break;
      case 'CONFIRMED':
      case 'IMPORTING':
        this.status.set('Importing contacts…');
        break;
      case 'IMPORTED':
        this.status.set(`Imported ${job.totals.new ?? job.total_rows} contacts.`);
        break;
      case 'CANCELLED':
        this.status.set('Import cancelled.');
        break;
      default:
        this.status.set('Import blocked. No contacts were saved. Review the errors below.');
    }
  }

  watchJob(): void {
    const job = this.job();
    if (!job) return;
    this.watcher?.unsubscribe();
    this.error.set('');
    this.checkingFailed.set(false);
    this.uploading.set(true);
    this.watcher = this.importService
      .watch(job.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => this.showJob(updated),
        error: () => {
          this.uploading.set(false);
          this.checkingFailed.set(true);
          this.error.set('Could not check import status. Retry the status check before taking another action.');
        },
      });
  }

  async upload(event: FileUploadHandlerEvent): Promise<void> {
    if (this.uploading()) return;
    this.resetResult();
    const file = event.files[0];
    if (
      event.files.length !== 1 ||
      !file ||
      !file.name.toLowerCase().endsWith('.csv') ||
      !file.size ||
      file.size > this.maxFileSize
    ) {
      this.error.set('Choose one nonempty CSV file up to 10 MB.');
      return;
    }
    this.uploading.set(true);
    this.status.set('Uploading…');
    try {
      this.showJob(await this.importService.upload(file));
      this.watchJob();
    } catch {
      this.uploading.set(false);
      this.status.set('');
      this.error.set('Could not upload the CSV. Check your connection and committee access, then try again.');
    }
  }

  async confirm(): Promise<void> {
    const job = this.job();
    if (!job || !this.canConfirm()) return;
    this.uploading.set(true);
    this.error.set('');
    try {
      this.showJob(await this.importService.confirm(job.id));
      this.watchJob();
    } catch {
      // A lost response does not establish whether confirmation reached the server.
      this.uploading.set(false);
      this.checkingFailed.set(true);
      this.error.set('Could not confirm the import status. Retry the status check before confirming again.');
    }
  }
}
