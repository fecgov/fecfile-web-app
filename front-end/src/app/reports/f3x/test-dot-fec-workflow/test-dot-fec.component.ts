import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ReportF3X } from 'app/shared/models/report-f3x.model';
import { ApiService } from 'app/shared/services/api.service';
import { environment } from 'environments/environment';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-test-dot-fec',
  templateUrl: './test-dot-fec.component.html',
})
export class TestDotFecComponent extends DestroyerComponent implements OnInit {
  report: ReportF3X | undefined;
  fileIsGenerated = false;
  constructor(private store: Store, private apiService: ApiService, private http: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report));
    this.fileIsGenerated = false;
  }

  generate(): void {
    this.apiService.post(`/web-services/dot-fec/`, { report_id: this.report?.id }).subscribe(() => undefined);
    this.fileIsGenerated = true;
  }

  download(): void {
    // prettier-ignore
    this.http
      .get(`${environment.apiUrl}/web-services/dot-fec/${this.report?.id}/`, {
        headers: this.apiService.getHeaders(),
        responseType: 'text',
        withCredentials: true,
      })
      .subscribe((dotFEC: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const newBlob = new Blob([dotFEC], { type: 'application/text' });
        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = this.report?.id + '.fec';
        link.click();
      });
  }
}
