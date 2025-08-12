import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { PrimeTemplate } from 'primeng/api';
import { Toolbar } from 'primeng/toolbar';
import { ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { Ripple } from 'primeng/ripple';
import { FecDatePipe } from '../../shared/pipes/fec-date.pipe';
import { TableActionsButtonComponent } from 'app/shared/components/table-actions-button/table-actions-button.component';
import { TableListBaseComponent, TableAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { TableComponent } from 'app/shared/components/table/table.component';
import { Import } from 'app/shared/models/import.model';
import { ImportService } from 'app/shared/services/import.service';

@Component({
  selector: 'app-import-list',
  templateUrl: './import-list.component.html',
  styleUrls: ['./import-list.component.scss'],
  imports: [
    TableComponent,
    Toolbar,
    PrimeTemplate,
    ButtonDirective,
    Ripple,
    TableActionsButtonComponent,
    FecDatePipe,
    DialogModule,
    FileUploadModule,
  ],
})
export class ImportListComponent extends TableListBaseComponent<Import> {
  public readonly router = inject(Router);
  protected readonly itemService = inject(ImportService);
  private readonly store = inject(Store);

  readonly dialogVisible = signal(false);
  readonly committeeAccount = this.store.selectSignal(selectCommitteeAccount);
  readonly dotFECFile = signal<File | null>(null);
  @ViewChild('dotFECFileUpload') fileUpload!: FileUpload;

  public rowActions: TableAction[] = [
    new TableAction('Review', this.viewImport.bind(this), (item) => {
      return item.status === 'Awaiting user review and approval';
    }),
    new TableAction('Cancel', this.confirmDelete.bind(this), (item) => {
      return item.status !== 'Successfully created data from dotFEC';
    }),
    new TableAction('View Report', this.viewReport.bind(this), (item) => {
      return item.status === 'Successfully created data from dotFEC';
    }),
  ];

  readonly sortableHeaders: { field: string; label: string }[] = [
    { field: 'report_type', label: 'Report Type' },
    { field: 'coverage_through_date', label: 'Coverage' },
    { field: 'status', label: 'Status' },
  ];

  override readonly caption = 'Data table of all dotFEC files imported by this committee';

  protected getEmptyItem(): Import {
    return new Import();
  }

  public override async editItem(item: Import): Promise<boolean> {
    return this.router.navigateByUrl(`/imports/${item.id}/`);
  }

  public hasAttachedFile(): boolean {
    return this.fileUpload && this.fileUpload.files.length > 0;
  }

  public confirmDelete(import_obj: Import): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel this import? This action cannot be undone.',
      header: 'Hang on...',
      rejectLabel: 'No',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptLabel: 'Yes',
      acceptIcon: 'none',
      accept: async () => this.delete(import_obj),
    });
  }

  async uploadFile() {
    if (this.fileUpload.files[0]) {
      await (this.itemService as ImportService).create(this.fileUpload.files[0]);
      this.dialogVisible.set(false);
      this.refreshTable();
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'DotFEC File Uploaded',
        life: 3000,
      });
    }
  }

  async approveImport(import_obj: Import) {
    await this.itemService.approveForImport(import_obj);
    this.refreshTable();
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Import Approved',
      life: 3000,
    });
  }

  async delete(import_obj: Import) {
    await this.itemService.delete(import_obj);
    this.refreshTable();
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Import Canceled',
      life: 3000,
    });
  }

  public viewImport(import_obj: Import) {
    const import_id = import_obj.id;
    if (import_id) {
      this.router.navigateByUrl(`/imports/${import_id}`);
    }
  }

  public viewReport(import_obj: Import) {
    const report_id = import_obj.report;
    if (report_id) {
      this.router.navigateByUrl(`/reports/transactions/report/${report_id}/list`);
    }
  }

  public displayName(item: Import): string {
    return item.report_type ?? '';
  }

  public showDialog(): void {
    this.dialogVisible.set(true);
  }
}
