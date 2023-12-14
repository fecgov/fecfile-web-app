import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Report } from 'app/shared/models/report.model';
import { ApiService } from 'app/shared/services/api.service';
import { environment } from 'environments/environment';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-test-dot-fec',
  templateUrl: './test-dot-fec.component.html',
})
export class TestDotFecComponent extends DestroyerComponent implements OnInit {
  report: Report | undefined;
  fileIsGenerated = false;
  constructor(private apiService: ApiService, private http: HttpClient, private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.report = data['report'];
    });
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
