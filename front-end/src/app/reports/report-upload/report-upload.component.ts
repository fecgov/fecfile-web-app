import { Component } from '@angular/core';
import { ReportService } from 'app/shared/services/report.service';
import { Report } from 'app/shared/models/report.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-report-upload',
  templateUrl: './report-upload.component.html',
  styleUrl: './report-upload.component.scss',
})
export class ReportUploadComponent {
  selectedFile?: File;
  reports: Report[] = [];
  selectedReportId: string = '';
  pdfs: any[] = [];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    if (!this.selectedFile) return;
    this.reportService.uploadPdf(this.selectedReportId, this.selectedFile).subscribe(() => {
      this.loadPdfs(this.selectedReportId);
    });
  }

  async loadReports() {
    this.reports = await this.reportService.getAllReports();
  }

  loadPdfs(reportId: string): void {
    this.reportService.getPdfs(reportId).subscribe((data) => {
      this.pdfs = data.results;
    });
  }

  downloadFile(pdf: any) {
    const link = `${environment.apiUrl}/reports/pdfs/download_pdf?id=${pdf.id}`;
    window.open(link);
  }
}
